import { Ticker } from 'pixi.js';
import { LinkedList } from './utils';

type TaskCallback =
/**
 * A function which can be called at a specific time in the future.
 * @param {number} timeSinceLast The time, in seconds, since the last time this task was called.
 * @param {Task} task The task itself. Can be paused, resumed, given additional functions, or cancelled.
 */
(timeSinceLast: number, task: Task) => void;

export interface Task {
  paused: boolean;
  /**
   * Adds an function to be called when the scheduled time arrives.
   * @param {TaskCallback} operation The function.
   */
  add(operation: TaskCallback): void;
  cancel(): void;
}

class SchedulerTask implements Task {
  private operations = new LinkedList<TaskCallback>();
  public paused = false;
  public interval: number;
  private timeSinceLast = 0;
  private timeUntilRun = 0;

  private cancelled = false;

  constructor(delay: number, interval = -1) {
    this.timeUntilRun = delay;
    this.interval = interval;
  }

  public add(operation: TaskCallback): this;
  public add(...operations: TaskCallback[]): this;
  public add(...operations: TaskCallback[]): this {
    operations.forEach(this.operations.pushAll);
    return this;
  }

  /**
   * 
   * @param {number} delta The time, in seconds, since the function was last called
   * @returns {boolean} Whether the task should be removed from the scheduler
   */
  public tick(delta: number): boolean {
    this.timeSinceLast += delta;
    if (this.paused) return this.cancelled;
    if ((this.timeUntilRun = this.timeUntilRun - delta) >= 0) return this.cancelled;
    this.runImmediately();
    if (this.interval > 0) { // if the interval is set, set time until next run to be the interval minus any lost time
      if ((this.timeUntilRun += this.interval) < 0) return this.tick(0); // catch up if we've missed a run
      return this.cancelled;
    } else {
      return this.cancelled = true;
    }
  }

  private runImmediately(): boolean {
    for (const operation of this.operations) {
      if (this.cancelled) return true;
      operation(this.timeSinceLast, this);
    }
    this.timeSinceLast = 0;
    return this.cancelled;
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

export const TaskSystem = {
  scheduleRepeating(operations: TaskCallback[] | TaskCallback, delay: number, interval: number, priority = TaskPriority.Default) {
    const task = new SchedulerTask(delay, interval).add(...(Array.isArray(operations) ? operations : [operations]));
    taskPriorityList.getIndex(priority).pushAll(task);
    return task;
  },
  schedule(operations: TaskCallback[] | TaskCallback, delay: number, priority = TaskPriority.Default): Task {
    return this.scheduleRepeating(operations, delay, -1, priority);
  }
};