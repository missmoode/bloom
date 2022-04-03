import { Loader } from '@pixi/loaders';
import { Dict } from '@pixi/utils';
import { ShaderLoaderPlugin } from './shaderloaderplugin';

export type ResourceTarget = string;

export type ResourceContainer = {
  _resources: ResourceTarget[]
}
export type Resourceful<T> = T & ResourceContainer;

export class Resources {
  private static reservations: Dict<number> = {};

  static {
    Loader.registerPlugin(new ShaderLoaderPlugin());
  }

  private constructor() {
    /** */
  }

  /**
   * @param base The object to attach resources to
   * @param resources The resources the view requires
   * @returns The view constructor packed with the resource keys for later loading
   */
  public static attach<T>(base: T, resources: ResourceTarget[]): Resourceful<T> {
    return {
      ...base,
      _resources: resources
    } as Resourceful<T>;
  }

  public static loaded(resourcefulObject: ResourceContainer) {
    for (const key in resourcefulObject._resources) {
      const r = Loader.shared.resources[key];
      if (!r) return false;
      if (!r.isComplete) return false;
    }
    return true;
  }

  public static load(resourcefulObject: ResourceContainer) {
    for (const key in resourcefulObject._resources) {
      if (!this.reservations[key]) this.reservations[key] = 0;
      this.reservations[key]++;
      if (!Loader.shared.resources[key]) {
        Loader.shared.add(key, key);
      }
    }
    Loader.shared.load();
  }

  public static unload(resourcefulObject: ResourceContainer) {
    for (const key in resourcefulObject._resources) {
      if (this.reservations[key]) {
        this.reservations[key]--;
        if (this.reservations[key] == 0) {
          delete Loader.shared.resources[key];
        }
      }
    }
  }
}