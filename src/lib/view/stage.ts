import { Container } from 'pixi.js';
import { Point } from 'pixi.js';
import { FixedViewport } from './Viewport';

type Passed = 'addChild' | 'addChildAt' | 'removeChild' | 'removeChildAt' | 'removeChildren' | 'swapChildren' | 'getChildIndex' | 'setChildIndex' | 'sortChildren' | 'sortDirty' | 'sortableChildren' | 'children';

export interface Stage extends Pick<Container, Passed> {
  get mid(): Point;
}
export class StageInternal extends Container implements Stage {
  public readonly host: FixedViewport;

  constructor(host: FixedViewport) {
    super();
    this.host = host;
  }

  get mid(): Point {
    return new Point(this.host.width/2, this.host.height/2);
  }
  
}