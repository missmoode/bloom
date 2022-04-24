import { GameCanvas } from './game/gamecanvas';
import { FixedViewport } from './view';

export * from './view';
export * from './utils';
export * from './resources';
export * from './helpers';
export * from './TaskSystem';

const canvas: GameCanvas = new GameCanvas(document.getElementsByTagName('main')[0]);

export const Game = {
  get rootStage(): FixedViewport {
    return canvas.viewport;
  }
};