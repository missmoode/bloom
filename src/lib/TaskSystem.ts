/** @module Task Scheduler */
import { Ticker } from 'pixi.js';
import { LinkedList } from './utils';

export const TaskSystem = {
  /**
   * Run a repeating task.
   * @param operations - Either one or a collection of task callbacks to run.
   * @param delay - Interval to wait before the first run, defined using {@linkcode Interval.seconds} or {@linkcode Interval.ticks}.
   * @param interval - An interval between runs.
   * @param [priority=TaskPriority.Default] - What position in the task order to run the task.
   * @returns A task handle for cancelling or pausing.
   */
  scheduleRepeating(operations: Iterable<TaskCallback> | TaskCallback, delay: Interval, interval: Interval, priority: TaskPriority = TaskPriority.Default): Task {
    return _schedule(operations, delay, interval, priority);
  },
  /**
   * Run a delayed task.
   * @param operations - Either one or a collection of task callbacks to run.
   * @param delay - Interval to wait, defined using {@linkcode Interval.seconds} or {@linkcode Interval.ticks}.
   * @param [priority=TaskPriority.Default] - What position in the task order to run the task.
   * @returns A task handle for cancelling or pausing.
   */
  schedule(operations: Iterable<TaskCallback> | TaskCallback, delay: Interval, priority: TaskPriority = TaskPriority.Default): Task {
    return _schedule(operations, delay, undefined, priority);
  }
};

export type TaskCallback =
/**
 * A function which can be called at a specific time in the future.
 * @param {number} delta The time, in seconds, since the last time this task was called.
 * @param {Task} task The task itself. Can be paused, resumed, given additional functions, or cancelled.
 */
(delta: number, task: Task) => void;

export interface Task {
  readonly operations: LinkedList<TaskCallback>;
  paused: boolean;
  /**
   * Adds an function to be called when the scheduled time arrives.
   * @param {TaskCallback} operation The function.
   */
  cancel(): void;
}

class SchedulerTask implements Task {
  private cancelled = false;
  private _operations = new LinkedList<TaskCallback>();

  private _delay: Interval;
  private _interval?: Interval;
  private hasRunPreviously = false;

  public paused = false;

  private _elapsedTime = 0;
  private _elapsedTicks = 0;

  /**
   * The amount of time, in seconds, since the task was last called.
   */
  protected get elapsedTime(): number {
    return this._elapsedTime;
  }
  /**
   * The amount of ticks since the task was last called.
   */
  protected get elapsedTicks(): number {
    return this._elapsedTicks;
  }
  constructor(operations: Iterable<TaskCallback>, delay: Interval, interval?: Interval) {
    this._operations.pushAll(operations);
    this._delay = delay;
    this._interval = interval;
  }

  /**
   * 
   * @param {number} delta The time, in seconds, since the function was last called
   * @returns {boolean} Whether the task should be removed from the scheduler
   */
  public tick(delta: number): boolean {
    if (this.cancelled) return true;
    this._elapsedTime += delta;
    this._elapsedTicks++;
    if (this.paused) return false;
    if (this.shouldRunNow) {
      for (const operation of this._operations.values) {
        operation(delta, this);
      }
    }
    this._elapsedTicks = this._elapsedTime = 0;
    return this.cancelled;
  }


  get shouldRunNow(): boolean {
    let run;
    switch (this._delay.type) {
    case 'ticks': {
      run = (this._elapsedTicks >= this._delay.interval);
      break;
    }
    case 'time': {
      run = (this._elapsedTime >= this._delay.interval);
      break;
    }
    default: {
      throw new Error('Unknown interval type ' + this._delay.type);
    }
    }
    if (run && !this.hasRunPreviously) {
      this.hasRunPreviously = true;
      if (this._interval !== undefined) { // If this is the first run, and there's a repeat interval, use it in the future.
        this._delay = this._interval;
        this._interval = undefined;
      } else { // If there's no repeat interval, we're done.
        this.cancel(); // Cancel after running once.
      }
    }
    return run;
  }

  get operations(): LinkedList<TaskCallback> {
    return this._operations;
  }

  public cancel(): void {
    this.cancelled = true;
  }
}



export enum TaskPriority {
  PreUpdate = 0,
  Update = 1,
  Default = 2, // After Update, Before Render
  Render = 3,
  PostRender = 4
}

const taskPriorityList = new LinkedList(
  new Array<LinkedList<SchedulerTask>>(5)
    .map(() => new LinkedList<SchedulerTask>())
);

Ticker.shared.add(tickAll);
function tickAll(delta: number): void {
  taskPriorityList.forEach(tL => tL.cull(task => task.tick(delta)));
}

/**
 * @hidden
 */
export type Interval<type = 'ticks' | 'time'> = {
  type: type;
  interval: number;
}

export const Interval = {
  /**
   * An interval specified in ticks (using Ticker.shared).
   * @param interval A whole number of ticks above zero. Will be coerced to an absolute and then whole number (rounding up).
   * @returns An interval that can be interpreted by the scheduler.
   */
  ticks: (interval: number): Interval<'ticks'> => ({ type: 'ticks', interval: Math.ceil(Math.abs(interval)) }),
  /**
   * An interval specified in seconds (using Ticker.shared).
   * @param interval A number of seconds above zero. Will be coerced to an absolute number.
   * @returns An interval that can be interpreted by the scheduler.
   */
  seconds: (interval: number): Interval<'time'> => ({ type: 'time', interval: Math.abs(interval) }),
  /**
   * Run as soon as possible.
   */
  Zero: { type: 'ticks', interval: 0 } as Readonly<Interval<'ticks'>>
};

function _schedule(operations: Iterable<TaskCallback> | TaskCallback, delay: Interval, interval?: Interval, priority: TaskPriority = TaskPriority.Default): Task {
  const task = new SchedulerTask((Array.isArray(operations) ? operations : [operations]), delay, interval);
  taskPriorityList.getIndex(priority).value.push(task);
  return task;
}
