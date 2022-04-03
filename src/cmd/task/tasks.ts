import { Config } from '../config';
import { Logger } from '../utils/logger';

type TaskFunction = {
  (log: Logger, config: Config): NodeJS.ReadWriteStream | Promise<any>;
  displayName?: string;
}

type Task = {
  (log: Logger, config: Config): Promise<any>;
}

// Adapt a stream to a promise
function asPromise(stream: NodeJS.ReadWriteStream): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stream.on('end', () => resolve());
    stream.on('error', error => reject(error));
  });
}

// Test if a value is a NodeJS.ReadWriteStream or a Promise
function isStream(value: any): value is NodeJS.ReadWriteStream {
  return value && typeof value.pipe === 'function';
}

export function task(fn: TaskFunction): Task {
  fn.displayName ??= fn.name;
  const out: Task = (logger: Logger, config: Config) => {
    const taskLogger = logger.createLogger(fn.displayName);
    taskLogger.info('Starting task...', '🚀');
    let ret = fn(logger, config);
    if (isStream(ret)) {
      ret = asPromise(ret);
    }
    ret.then(() => {taskLogger.info('Task finished!', '🎉');});
    ret.catch(error => {taskLogger.error(error.message, '💥'); process.exit(1);});
    return ret;
  };
  return out;
}

// Take series of tasks and return a task which runs them in sequence
export function sequence(...tasks: Task[]): Task {
  return (logger: Logger, config: Config) => {
    return tasks.reduce((prev, task) => {
      return prev.then(() => task(logger, config));
    }, Promise.resolve());
  };
}