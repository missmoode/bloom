/** @module Game */
import { FixedViewport } from '../view';
import { GameCanvas } from './GameCanvas';

const canvas: GameCanvas = new GameCanvas(document.getElementsByTagName('main')[0]);

export const Game = {
  get rootStage(): FixedViewport {
    return canvas.viewport;
  }
};