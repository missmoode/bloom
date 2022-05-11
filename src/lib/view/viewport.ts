import { Container, IDestroyOptions } from 'pixi.js';
import { StageInternal } from './Stage';
import { Interface } from '../utils/private';
import { Task, Interval, TaskPriority, TaskSystem } from '../TaskSystem';
import { MutableViewport } from './IViewport';
import { View } from './View';
import { ViewConstructor, ViewConstructorParameters } from './ViewConstructor';

export class InternalViewport extends Container implements MutableViewport {

  private view?: View;
  public updateTask?: Task;

  private __width: number;
  private __height: number;

  constructor(width = 0, height = width) {
    super();
    this.__width = width;
    this.__height = height;
  }


  public override get width(): number {
    return this.__width;
  }
  public override set width(width: number) {
    this.resize(width, this.__height);
  }

  public override get height(): number {
    return this.__height;
  }
  public override set height(height: number) {
    this.resize(this.__width, height);
  }

  public resize(width: number, height = width) {
    this.__width = width;
    this.__height = height;
    if (this.view && this.view.resize) this.view.resize();
  }

  public goto<C extends ViewConstructor>(View: C, ...params:  ViewConstructorParameters<C>): void {
    this.clean();
    this.view = new View(new StageInternal(this), params);
    if (this.view.open) this.view.open.call(this.view);
    this.addChild(this.view.stage as StageInternal);
    if (this.view.resize) this.view.resize.call(this.view);
    if (this.view.update) {
      this.updateTask = TaskSystem.scheduleRepeating(this.view.update, Interval.Zero, Interval.ticks(1), TaskPriority.Update);
    }
  }

  private clean() {
    if (this.view) {
      if (this.updateTask) {
        this.updateTask.cancel();
        this.updateTask = undefined;
      }
      this.removeChild(this.view?.stage as StageInternal);
      if (this.view.close) this.view.close.call(this.view);
      (this.view?.stage as StageInternal).destroy(true);
    }
  }

  override destroy(options?: boolean | IDestroyOptions): void {
    this.clean();
    super.destroy(options);
  }
}

export const Viewport = InternalViewport as Interface<MutableViewport, typeof InternalViewport>;