/// <reference types="node" />
import { Config } from "../config";
import { Logger } from "../logger";
export declare type TaskFunction<Result = NodeJS.ReadWriteStream | Promise<any>> = {
    (log: Logger, config: Config): Result;
};
export declare function task(fn: TaskFunction, name?: string): TaskFunction<Promise<void>>;
export declare function sequence(...tasks: TaskFunction[]): TaskFunction<Promise<void>>;
