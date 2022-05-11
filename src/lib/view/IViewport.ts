import { DisplayObject } from 'pixi.js';
import { ViewConstructor, ViewConstructorParameters } from './ViewConstructor';

export interface MutableViewport extends FixedViewport, DisplayObject {
  set width(width: number); set height(height: number); resize(width: number, height?: number): void;
}

export interface FixedViewport {
  get width(): number; get height(): number;
  /**
   * Host a view.
   * @param View The constructor for the view to load.
   * @param params The parameters to pass to the view constructor (after the stage).
   */
  goto<C extends ViewConstructor>(View: C, ...params: ViewConstructorParameters<C>): void;
}
