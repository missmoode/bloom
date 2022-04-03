import { Stage } from './stage';

export abstract class View {
  public readonly stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  onSizeChanged() {
  }
}
export type ViewConstructor<T extends View> = new (stage: Stage, opts: any | undefined) => T;
export type DefaultViewConstructor<T extends View> = new (stage: Stage, opts: undefined) => T;
export type ArgumentViewConstructor<T extends View> = new (stage: Stage, opts: any) => T;