import { Stage } from './IStage';
import { FixedViewport } from './IViewport';
import { StageInternal } from './Stage';
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
   * Runs immediately before the stage is added to the display hierarchy.
   */
  public open?(): void;
  /**
   * Runs immediately after the stage is removed from the display hierarchy.
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