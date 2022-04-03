import { Application } from '@pixi/app';
import { DisplayObject, IDestroyOptions } from '@pixi/display';
import { FixedViewport } from '../view';
import { InternalViewport } from '../view/viewport';

export interface GameSession extends FixedViewport, Pick<DisplayObject, 'destroy'> {
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

  override destroy(options: boolean | IDestroyOptions = true): void {
    this.app?.destroy(true);
    this.resizeObserver.disconnect();
  }
}