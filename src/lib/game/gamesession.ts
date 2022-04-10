import { Application } from '@pixi/app';
import { FixedViewport } from '../view';
import { InternalViewport } from '../view/viewport';

export interface GameSession extends FixedViewport {
  destroy(): void;
}

export class InternalGameSession extends InternalViewport implements GameSession {
  private app?: Application;

  private resizeObserver: ResizeObserver = new ResizeObserver((e) => {
    this.resize(e[0].contentRect.width, e[0].contentRect.height);
  });

  public constructor(containerElement: HTMLElement) {
    super(containerElement.clientWidth, containerElement.clientHeight);
    this.app = new Application({
      resolution: window.devicePixelRatio || 1,
      resizeTo: containerElement,
      autoDensity: true
    });

    this.app.stage = this;

    this.resizeObserver = new ResizeObserver((e) => {
      this.resize(e[0].contentRect.width, e[0].contentRect.height);
    });
    this.resizeObserver.observe(containerElement);
  }

  override destroy(): void {
    this.app?.destroy();
    this.resizeObserver.disconnect();
  }
}