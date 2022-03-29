import { Scene } from "./scene";
import { Container, DisplayObject } from "@pixi/display";
import { Renderer } from "@pixi/core";
import { Stage, StageInternal } from "./stage";

export interface FixedSceneHost {
  get width(): number;
  get height(): number;
  goto<S extends Scene>(link: SceneHost.Link<S>): void;
  finish(): void;
}
export interface SceneHost extends DisplayObject, FixedSceneHost {
  set width(width: number);
  set height(height: number);
  resize(width: number, height?: number): void;
};

export namespace SceneHost {
  export type Link<S extends Scene = Scene> = { Target: Scene.Target<S>, Options: Scene.Parameters<S> }
}

export function createSceneHost(width = 0, height = width): SceneHost {
  return new InternalSceneHost(width, height);
}

export function createSceneLink<S extends Scene>(Target: Scene.Target<S>, ...Options: Scene.Parameters<S>): SceneHost.Link {
  return {Target, Options};
}

export class InternalSceneHost extends Container implements SceneHost {
  private scene?: Scene;

  private __width: number;
  private __height: number;

  constructor(width: number, height: number) {
    super();
    this.__width = width;
    this.__height = height;
  }


  public get width(): number {
    return this.__width;
  }
  public set width(width: number) {
    this.__width = width;
    this.resize(width, this.__height);
  }

  public get height(): number {
    return this.height;
  }
  public set height(height: number) {
    this.__height = height;
    this.resize(this.__width, height);
  }

  public resize(width: number, height = width) {
    if (this.scene) {
      this.scene.onSizeChanged();
    }
  }

  public goto<S extends Scene>(link: SceneHost.Link<S>) {
    this.scene = new link.Target.Scene(new StageInternal(this), ...link.Options);
  }

  /**
   * Informs the game that the scene is no longer running.
   * This tells the game that:
   *  - Any assets that only it was using can be safely unloaded.
   *  - It no longer needs to listen for events or receive update signals.
   */
  public finish() {
    if (this.scene) {
      this.removeChild(this.scene?.stage as StageInternal);
      (this.scene?.stage as StageInternal).destroy(true);
    }
  }
}