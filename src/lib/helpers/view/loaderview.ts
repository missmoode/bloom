
import * as Resourceful from '../../resources';
import { ViewConstructor, View, ViewTarget, Stage } from '../../view';

// function flow()
// public goto<V extends View>(View: DefaultViewConstructor<V>): void;
// public goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;


export abstract class LoaderView extends View {
  private target: ViewTarget<Resourceful.Attachment<ViewConstructor>>;
  /**
   * @example
   * import { LoaderView, target } from 'bloom';
   * new LoaderView(stage, target(View, options));
   * @param stage The stage to attach the view to (handled by the viewport).
   * @param target The view to load.
   */
  constructor(stage: Stage, target: ViewTarget<Resourceful.Attachment<ViewConstructor>>) {
    super(stage);
    this.target = target;
  }

  public override open(): void {
    const availability = Resourceful.prepare(this.target.View);
    if (availability.state === Resourceful.State.Ready) {
      this.host.goto(this.target.View, ...this.target.params);
      return;
    } else if (availability.state === Resourceful.State.Error) {
      throw new Error(`Failed to load ${this.target.View.name}`);
    } else {
      availability.onProgress.add(this.onProgress.bind(this));
      availability.onDone.once(() => {
        this.host.goto(this.target.View, ...this.target.params);
      }, this);
    }
  }

  public abstract onProgress(progress: number): void;
  
}