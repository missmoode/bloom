import { Config } from "../config";
import { Logger } from "../logger";

export type TaskFunction<Result = NodeJS.ReadWriteStream | Promise<any>> = {
  (log: Logger, config: Config): Result;
}

// Adapt a stream to a promise
function asPromise(stream: NodeJS.ReadWriteStream): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      stream.on("end", () => resolve());
      stream.on("error", error => reject(error));
  });
}

// Test if a value is a NodeJS.ReadWriteStream or a Promise
function isStream(value: any): value is NodeJS.ReadWriteStream {
  return value && typeof value.pipe === "function";
}

function pretty(str: string): string {
  return str.charAt(0).toUpperCase + str.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2');
} 

export function task(fn: TaskFunction, name: string = pretty(fn.name)): TaskFunction<Promise<void>> {
  const out = (logger: Logger, config: Config) => {
    const taskLogger = logger.createLogger(name);
    taskLogger.info('Starting task...', '🚀');
    let ret = fn(logger, config);
    if (isStream(ret)) {
      ret = asPromise(ret);
    }
    ret.then(() => {taskLogger.info('Task finished!', '🎉');})
    ret.catch(error => {taskLogger.error(error.message, '💥'); process.exit(1)});
    return ret;
  }
  return out;
}

export function sequence(...tasks: TaskFunction[]): TaskFunction<Promise<void>> {
  return (logger: Logger, config: Config) => {
    return tasks.reduce((prev, task) => {
      return prev.then(() => task(logger, config));
    }, Promise.resolve());
  }
}