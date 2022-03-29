import { Application } from "@pixi/app";
import { FixedSceneHost, Scene } from "../scene";
import { InternalSceneHost } from "../scene/host";
import { Constructor } from "../util";

export interface GameSession extends FixedSceneHost {
  destroy(): void;
  
  prepareScene<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest) : Scene.Target<S>;
}

export class InternalGameSession extends InternalSceneHost implements GameSession {
  private app?: Application;

  private resizeObserver: ResizeObserver = new ResizeObserver((e) => {
    this.resize(e[0].contentRect.width, e[0].contentRect.height);
  });

  public constructor(containerElement: HTMLElement) {
    super(containerElement.clientWidth, containerElement.clientHeight)
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

  destroy(): void {
    this.app?.destroy(true);
    this.resizeObserver.disconnect();
  }
  
  prepareScene<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest) : Scene.Target<S> {
    return { Scene, manifest };
  }
}

export const Game: GameSession = new InternalGameSession(document.getElementsByTagName('main')[0]);