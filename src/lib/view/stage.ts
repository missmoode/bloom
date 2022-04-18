import { Container } from 'pixi.js';
import { Point } from 'pixi.js';
import { FixedViewport } from './viewport';

type Passed = 'addChild' | 'addChildAt' | 'removeChild' | 'removeChildAt' | 'removeChildren' | 'swapChildren' | 'getChildIndex' | 'setChildIndex' | 'sortChildren' | 'sortDirty' | 'sortableChildren' | 'children' | 'render' | 'calculateBounds';

export interface Stage extends Pick<Container, Passed> {
  get width(): number;
  get height(): number;
  
  get mid(): Point;
}
export class StageInternal extends Container implements Stage {
  private host: FixedViewport;

  constructor(host: FixedViewport) {
    super();
    this.host = host;
  }

  public override get width(): number {
    return this.host.width;
  }
  public override get height(): number {
    return this.host.height;
  }

  get mid(): Point {
    return new Point(this.width/2, this.height/2);
  }
  
}