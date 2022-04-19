import { Stage, StageInternal } from './stage';
import { FixedViewport } from './viewport';
export abstract class View {
  public readonly stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  /**
   * Access the viewport for 
   */
  public get host(): FixedViewport {
    return (this.stage as StageInternal).host;
  }
  
  /**
   * Runs after the stage is added to the display hierarchy.
   */
  public open?(): void;
  /**
   * Runs before the stage is removed from the display hierarchy.
   */
  public close?(): void;
  /**
   * Runs after open or when the viewport size changes.
   */
  public resize?(): void;
  /**
   * Called every frame.
   * @param deltaMillis The time since the last frame in milliseconds.
   */
  public update?(deltaMillis: number): void;

}
export type ViewConstructor<T extends View> = new (stage: Stage, opts: object | undefined) => T;
export type DefaultViewConstructor<T extends View> = new (stage: Stage, opts: undefined) => T;
export type ArgumentViewConstructor<T extends View> = new (stage: Stage, opts: object) => T;
