import { Stage } from './stage';
import { Ticker, UPDATE_PRIORITY } from '@pixi/ticker';
export abstract class View {
  public readonly stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }
  
  /**
   * Runs after the stage is added to the display hierarchy.
   */
  public open() {
    Ticker.shared.add(this.update, this, UPDATE_PRIORITY.LOW);
  }
  /**
   * Runs before the stage is removed from the display hierarchy.
   */
  public close() {
    Ticker.shared.remove(this.update, this);
  }
  /**
   * Runs when the viewport size changes.
   */
  public resize?(): void;
  /**
   * Called every frame.
   * @param deltaMillis The time since the last frame in milliseconds.
   */
  public abstract update(deltaMillis: number): void;

}
export type ViewConstructor<T extends View> = new (stage: Stage, opts: object | undefined) => T;
export type DefaultViewConstructor<T extends View> = new (stage: Stage, opts: undefined) => T;
export type ArgumentViewConstructor<T extends View> = new (stage: Stage, opts: object) => T;
