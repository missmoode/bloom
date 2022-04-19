import { LoaderResource } from 'pixi.js';
import { Signal } from 'type-signals';


type Binding = {percentage: number, progressBinding: ReturnType<LoaderResource['onProgress']['add']>, completeBinding: ReturnType<LoaderResource['onComplete']['add']>};

/**
 * Utility to expose the progress of asset loading distributed across multiple pixi loaders.
 */
export class Availability {
  #resources: Map<LoaderResource, Binding> = new Map();

  /**
   * A signal that is emitted when the preparation has completed or errored.
   */
  public readonly onDone = new Signal<OnComplete>();
  /**
   * A signal that is emittted when the percentage of the preparation has changed.
   */
  public readonly onProgress = new Signal<OnPercentageChange>();


  #percentage = 0;
  /**
   * The percentage of the preparation in the range [0, 1].
   */
  public get percentage(): number {
    return this.#percentage;
  }

  #state: State = State.INCOMPLETE;
  /**
   * The state of the preparation.
   */
  public get state(): State {
    return this.#state;
  }

  constructor(resources: LoaderResource[]) {
    for (const resource of resources) {
      if (resource.error) {
        this.error(resource.error);
        return;
      }
      const binding = this.#resources.get(resource);
      binding.percentage = resource.complete ? 0 : 100;
      binding.progressBinding = resource.onProgress.add(this.progressListener, this);
      binding.completeBinding = resource.onComplete.add(this.completeListener, this);
    }
  }
  
  private completeListener = (resource: LoaderResource) => {
    if (resource.error) {
      this.unbind();
      this.error(resource.error);
    } else {
      this.#resources.get(resource).percentage = 1;
      if (Array.from(this.#resources.values()).every(v => v.percentage === 1)) {
        this.unbind();
        this.#state = State.READY;
        this.onDone.dispatch();
      }
    }
  };
  

  private progressListener = (resource: LoaderResource, percentage: number) => {
    this.#resources.get(resource).percentage = percentage;
    this.#percentage = Array.from(this.#resources.values()).reduce((a, b) => a + b.percentage, 0) / this.#resources.size;
  };

  private error(error: Error) {
    this.#state = State.ERROR;
    this.onDone.dispatch(error);
  }

  private unbind() {
    for (const binding of this.#resources.values()) {
      binding.progressBinding.detach();
      binding.completeBinding.detach();
    }
  }

}

export enum State {
  /**
   * The preparation has yet to finish.
   */
  INCOMPLETE,
  /**
   * The preparation has finished with errors.
   */
  ERROR,
  /**
   * The preparation has finished without errors. Resources can now be used.
   */
  READY
}

/**
 * @callback OnPreparationEnded
 * @param {Error|undefined} error - The error that occurred, if any.
 */
type OnComplete = (error?: Error) => void;

/**
 * @callback OnPreparationEnded
 * @param {number} percentage - The percentage of the preparation in the range [0, 1].
 * @see {@link Availability#percentage}
 */
type OnPercentageChange = (percentage: number) => void;