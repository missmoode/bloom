import { Config } from '../config';
import { Logger } from '../utils';

export type TaskFunction<Result = NodeJS.ReadWriteStream | Promise<any>> = {
  (log: Logger, config: Config): Result;
  displayName?: string;
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

function pretty(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2');
} 

export function task(fn: TaskFunction): TaskFunction<Promise<void>> {
  const out = (logger: Logger, config: Config) => {
    fn.displayName ??= pretty(fn.name);
    if (fn.displayName && fn.displayName !== '' && logger.domain !== fn.displayName) {
      logger = logger.createLogger(fn.displayName);
      logger.info('Running task...', '⏳');
    }
    let ret = fn(logger, config);
    if (isStream(ret)) {
      ret = asPromise(ret);
    }
    ret.catch(error => {logger.error(error.message, '💥'); process.exit(1);});
    return ret;
  };
  return out;
}

// Run a series of tasks chronologically, waiting for each to finish before starting the next

export function sequence(...tasks: TaskFunction[]): TaskFunction<Promise<void>> {
  return (logger: Logger, config: Config) => {
    return tasks.reduce((prev, fn) => {
      return prev.then(() => {
        return task(fn)(logger, config);
      });
    }, Promise.resolve());
  };
}