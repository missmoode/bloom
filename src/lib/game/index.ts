import { FixedViewport } from '../view';
import { GameCanvas } from './GameCanvas';

export class Game {
  private canvas = new GameCanvas(document.getElementsByTagName('main')[0]);
  public get stage(): FixedViewport {
    return this.canvas.viewport;
  }
}