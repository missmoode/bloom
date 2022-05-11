import { Container } from 'pixi.js';
import { Point } from 'pixi.js';
import { Stage } from './IStage';
import { FixedViewport } from './IViewport';

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