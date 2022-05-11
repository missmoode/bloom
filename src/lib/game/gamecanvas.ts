import { AbstractRenderer, autoDetectRenderer, Renderer } from 'pixi.js';
import { Task, Interval, TaskPriority, TaskSystem } from '../TaskSystem';

import { MutableViewport, Viewport } from '../view';

/**
 * Each game has a state.
 * Each player has a uuid.
 * Multiplayer games have a state for each player.
 * GameSession.state is the game state
 * GameSession.
 */
/**
 * A local or remote game session.
 * Contains the game state.
 */

export class GameCanvas {
  private renderer: Renderer | AbstractRenderer;
  private renderTask: Task;
  public readonly viewport: MutableViewport;

  private _resize: ResizeObserver = new ResizeObserver((e) => {
    this.renderer.resize(e[0].contentRect.width, e[0].contentRect.height);
    this.viewport.resize(e[0].contentRect.width, e[0].contentRect.height);
  });


  public constructor(fills: HTMLElement) {
    const canvas = fills.appendChild(document.createElement('canvas'));
    this.viewport = new Viewport(fills.clientWidth, fills.clientHeight);

    this.renderer = autoDetectRenderer({
      view: canvas,
      resolution: window.devicePixelRatio ?? 1
    });

    this._resize.observe(fills);

    this.renderTask = TaskSystem.scheduleRepeating(this.render, Interval.Zero, Interval.ticks(1), TaskPriority.Render);
  }

  private render = () => {
    this.renderer.render(this.viewport);
  };

  public destroy(): void {
    this.renderTask.cancel();
    this.renderer.destroy();
    this._resize.disconnect();
  }
}