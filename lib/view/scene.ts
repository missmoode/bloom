import { Loader, LoaderResource } from "@pixi/loaders";
import { Stage } from "./stage";
import { View, ViewConstructor } from "./view";

  
type Resource = String;

/**
 * Details that the game needs to know to load the scene.
 */
export type Manifest = {
  /**
   * The resources that this scene requires.
   */
  resources: Resource[]
}

/**
 * A scene is a view connected to a scene manifest.
 * The scene manifest is used by the scene manager for critical pre-construction tasks, such as loading the resources.
 */
export type Scene<S extends View> = {
  /**
   * Scene constructor.
   */
  View: ViewConstructor<S>,
  /**
   * Details that the game needs to know to load the scene.
   */
  manifest: Manifest
}

export namespace Scenes {
  export function createScene<S extends View>(View: ViewConstructor<S>, manifest: Manifest): Scene<S> {
    return { View, manifest };
  }
  // export function loadScene<S extends View>(scene: Scene<S>): Scene<S> {
  //   for (const resource of scene.manifest.resources) {
  //   }
  // }
}

type HomeOpts = {
  name: string;
}
class HomeScene extends View {
  constructor(stage: Stage, opts: HomeOpts) {
    super(stage);
    /** */
  }
}
class TestScene extends View {
  constructor(stage: Stage) {
    super(stage);
    /** */
  }
}