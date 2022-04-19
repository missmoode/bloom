import { Stage } from '../stage';
import { ArgumentViewConstructor, DefaultViewConstructor, View, ViewConstructor } from '../view';

// function flow()
// public goto<V extends View>(View: DefaultViewConstructor<V>): void;
// public goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;

type ViewTarget<V extends View> = [ArgumentViewConstructor<V>, ConstructorParameters<ViewConstructor<V>>[1]] | [DefaultViewConstructor<V>];
type TargetList = [ViewTarget<View>][];
function series(...steps: ViewTarget<View>[]) {
}

class SeriesView extends View {
  public readonly stage: Stage;

  public open(): void {
    this.host.g.addChild();
  }

  public close(): void {
    this.stage.loader.close();
  }

  public resize(): void {
    this.stage.loader.resize();
  }

  public update(deltaMillis: number): void {
    this.stage.loader.update(deltaMillis);
  }
}