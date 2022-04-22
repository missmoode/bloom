import { Container, DisplayObject, IDestroyOptions, Ticker, TickerCallback, UPDATE_PRIORITY } from 'pixi.js';
import { StageInternal } from './Stage';
import { View, ViewConstructor, ViewConstructorParameters } from './View';
import { Interface } from '../utils/private';
export interface FixedViewport {
  get width(): number;
  get height(): number;

  /**
   * Host a view.
   * @param View The constructor for the view to load.
   * @param params The parameters to pass to the view constructor (after the stage).
   */
  goto<C extends ViewConstructor>(View: C, ...params:  ViewConstructorParameters<C>): void;
}
export interface MutableViewport extends DisplayObject, FixedViewport {
  set width(width: number);
  set height(height: number);
  resize(width: number, height?: number): void;
}

export class InternalViewport extends Container implements MutableViewport {
  private view?: View;
  public updateFunction?: TickerCallback<View>;

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
    if (this.view.resize) this.view.resize();
  }

  public goto<C extends ViewConstructor>(View: C, ...params:  ViewConstructorParameters<C>): void {
    this.clean();
    this.view = new View(new StageInternal(this), params);
    if (this.view.open) this.view.open.call(this.view);
    this.addChild(this.view.stage as StageInternal);
    if (this.view.resize) this.view.resize.call(this.view);
    if (this.view.update) {
      this.updateFunction = (delta: number) => this.view.update(delta);
      Ticker.shared.add(this.updateFunction, this.view, UPDATE_PRIORITY.NORMAL);
    }
  }

  private clean() {
    if (this.view) {
      if (this.view.update) Ticker.shared.remove(this.updateFunction, this.view);
      this.removeChild(this.view?.stage as StageInternal);
      if (this.view.close) this.view.close.call(this.view);
      (this.view?.stage as StageInternal).destroy(true);
    }
  }

  destroy(options?: boolean | IDestroyOptions): void {
    this.clean();
    super.destroy(options);
  }
}

export const Viewport = InternalViewport as Interface<MutableViewport, typeof InternalViewport>;