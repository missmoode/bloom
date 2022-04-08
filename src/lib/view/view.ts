import { Stage } from './stage';
export abstract class View {
  public readonly stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }
  
  /**
   * Runs after construction but before the stage is added to the display hierarchy.
   */
  public open?(): void;
  /**
   * Runs before the stage is removed from the display hierarchy.
   */
  public close?(): void;
  /**
   * Runs when the viewport size changes.
   */
  public resize?(): void;
  /**
   * Called every frame.
   * @param deltaMillis The time since the last frame in milliseconds.
   */
  public update?(deltaMillis: number): void;

}
export type ViewConstructor<T extends View> = new (stage: Stage, opts: any | undefined) => T;
export type DefaultViewConstructor<T extends View> = new (stage: Stage, opts: undefined) => T;
export type ArgumentViewConstructor<T extends View> = new (stage: Stage, opts: any) => T;
