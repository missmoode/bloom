import { LoaderResource } from 'pixi.js';
import { Signal } from 'type-signals';


/**
 * @hidden
 */
type Binding = {
  percentage: number,
  progressBinding: ReturnType<LoaderResource['onProgress']['add']>,
  completeBinding: ReturnType<LoaderResource['onComplete']['add']>
};

/**
 * Utility to expose the progress of asset loading distributed across multiple pixi loaders.
 */
export class ResourceLoaderHandle {
  private resources: Map<LoaderResource, Binding> = new Map();

  /**
   * A signal that is emitted when the preparation has completed or errored.
   */
  public readonly onDone = new Signal<OnComplete>();
  /**
   * A signal that is emittted when the percentage of the preparation has changed.
   */
  public readonly onProgress = new Signal<OnPercentageChange>();


  private _percentage = 0;
  /**
   * The percentage of the preparation in the range [0, 1].
   */
  public get percentage(): number {
    return this._percentage;
  }

  private _state: State = State.Incomplete;
  /**
   * The state of the preparation.
   */
  public get state(): State {
    return this._state;
  }

  constructor(resources: LoaderResource[]) {
    for (const resource of resources) {
      if (resource.error) {
        this.error(resource.error);
        return;
      }
      const binding = this.resources.get(resource);
      if (binding) {
        binding.percentage = resource.isComplete ? 0 : 100;
        binding.progressBinding = resource.onProgress.add(this.progressListener, this);
        binding.completeBinding = resource.onComplete.add(this.completeListener, this);
      }
    }
  }
  
  private completeListener = (resource: LoaderResource) => {
    if (resource.error) {
      this.unbind();
      this.error(resource.error);
    } else {
      const binding = this.resources.get(resource);
      if (binding) {
        binding.percentage = 1;
      }
      if (Array.from(this.resources.values()).every(v => v.percentage === 1)) {
        this.unbind();
        this._state = State.Ready;
        this.onDone.dispatch();
      }
    }
  };
  

  private progressListener = (resource: LoaderResource, percentage: number) => {
    const binding = this.resources.get(resource);
    if (binding) {
      binding.percentage = percentage;
      this._percentage = Array.from(this.resources.values()).reduce((acc, v) => acc + v.percentage, 0) / this.resources.size;
      this.onProgress.dispatch(this._percentage);
    }
  };

  private error(error: Error) {
    this._state = State.Error;
    this.onDone.dispatch(error);
  }

  private unbind() {
    for (const binding of this.resources.values()) {
      binding.progressBinding.detach();
      binding.completeBinding.detach();
    }
  }

}

export enum State {
  /**
   * The preparation has yet to finish.
   */
  Incomplete,
  /**
   * The preparation has finished with errors.
   */
  Error,
  /**
   * The preparation has finished without errors. Resources can now be used.
   */
  Ready
}

export type OnComplete = 
/**
 * @param {Error|undefined} error - The error that occurred, if any.
 */
(error?: Error) => void;

export type OnPercentageChange = 
/**
 * @param {number} percentage - The percentage of the preparation in the range [0, 1].
 */
(percentage: number) => void;