import { Container, DisplayObject, IDestroyOptions, Ticker, TickerCallback, UPDATE_PRIORITY } from 'pixi.js';
import { StageInternal } from './stage';
import { ArgumentViewConstructor, DefaultViewConstructor, ViewConstructor, View } from './view';
import { Interface } from '../utils/private';
export interface FixedViewport {
  get width(): number;
  get height(): number;

  goto<V extends View>(View: DefaultViewConstructor<V>): void;
  goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
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

  public goto<V extends View>(View: DefaultViewConstructor<V>): void;
  public goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
  public goto<V extends View>(View: ViewConstructor<V>, opts?: object): void {
    this.clean();
    this.view = new View(new StageInternal(this), opts);
    this.addChild(this.view.stage as StageInternal);
    // TODO: Check if it's resourceful and wait for it to finish loading.
    if (this.view.open) this.view.open();
    if (this.view.resize) this.view.resize();
    if (this.view.update) {
      this.updateFunction = (delta: number) => this.view.update(delta);
      Ticker.shared.add(this.updateFunction, this.view, UPDATE_PRIORITY.NORMAL);
    }
  }

  /**
   * Informs the game that the View is no longer running.
   * This tells the game that:
   *  - Any assets that only it was using can be safely unloaded.
   *  - It no longer needs to listen for events or receive update signals.
   */
  private clean() {
    if (this.view) {
      if (this.view.update) Ticker.shared.remove(this.updateFunction, this.view);
      if (this.view.close) this.view.close();
      this.removeChild(this.view?.stage as StageInternal);
      (this.view?.stage as StageInternal).destroy(true);
    }
  }

  destroy(options?: boolean | IDestroyOptions): void {
    this.clean();
    super.destroy(options);
  }
}

export const Viewport = InternalViewport as Interface<MutableViewport, typeof InternalViewport>;