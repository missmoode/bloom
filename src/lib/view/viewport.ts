import { Container, DisplayObject } from 'pixi.js';
import { StageInternal } from './stage';
import { ArgumentViewConstructor, DefaultViewConstructor, ViewConstructor, View } from './view';
import { Interface } from '../utils/private';

export interface FixedViewport {
  get width(): number;
  get height(): number;
  
  goto<V extends View>(View: DefaultViewConstructor<V>): void;
  goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
  finish(): void;
}
export interface MutableViewport extends DisplayObject, FixedViewport {
  set width(width: number);
  set height(height: number);
  resize(width: number, height?: number): void;
}

export class InternalViewport extends Container implements MutableViewport {
  private view?: View;

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
    if (this.view.resize) {
      this.view.resize();
    }
  }

  public goto<V extends View>(View: DefaultViewConstructor<V>): void;
  public goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
  public goto<V extends View>(View: ViewConstructor<V>, opts?: object): void {
    this.finish();
    this.view = new View(new StageInternal(this), opts);
    this.addChild(this.view.stage as StageInternal);
    this.view.open();
    this.view.resize();
  }

  /**
   * Informs the game that the View is no longer running.
   * This tells the game that:
   *  - Any assets that only it was using can be safely unloaded.
   *  - It no longer needs to listen for events or receive update signals.
   */
  public finish() {
    if (this.view) {
      this.view.close();
      this.removeChild(this.view?.stage as StageInternal);
      (this.view?.stage as StageInternal).destroy(true);
    }
  }
}

export const Viewport = InternalViewport as Interface<MutableViewport, typeof InternalViewport>;