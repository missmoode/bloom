import { Container } from "@pixi/display";
import { Point } from "@pixi/math";
import { SceneHost } from "./host";

type Passed = 'addChild' | 'addChildAt' | 'removeChild' | 'removeChildAt' | 'removeChildren' | 'swapChildren' | 'getChildIndex' | 'setChildIndex' | 'sortChildren' | 'sortDirty' | 'sortableChildren' | 'children' | 'render' | 'calculateBounds';

export interface Stage extends Pick<Container, Passed> {
  get width(): number;
  get height(): number;
  
  get mid(): Point;
}
export class StageInternal extends Container implements Stage {
  private host: SceneHost;

  constructor(host: SceneHost) {
    super();
    this.host = host;
  }

  public get width(): number {
    return this.host.width;
  }
  public get height(): number {
    return this.host.height;
  }

  get mid(): Point {
    return new Point(this.width/2, this.height/2);
  }
  
}