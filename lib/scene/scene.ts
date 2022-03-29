import { Constructor } from "../util";
import { Stage } from "./stage";

export abstract class Scene {
  public readonly stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  onSizeChanged() {
  }
}
  
type Path = String;

export namespace Scene {
  export type Target<S extends Scene> = {
    Scene: Constructor<S>,
    manifest: Manifest
  }
  type ShiftedConstructorParameters<C extends new (...args: any) => any>
  = ConstructorParameters<C> extends [infer _First, ...infer Rest] ? Rest : ConstructorParameters<C>;
  
  export type Parameters<S extends Scene> = ShiftedConstructorParameters<Constructor<S>>;

  export type Manifest = {
    resources: Path[]
  }
}

export function createSceneTarget<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest) {
  return { Scene, Manifest: manifest };
}