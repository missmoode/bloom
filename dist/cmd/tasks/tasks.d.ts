/// <reference types="node" />
import { Config } from '../config';
import { Logger } from '../utils';
export declare type TaskFunction<Result = NodeJS.ReadWriteStream | Promise<any>> = {
    (log: Logger, config: Config): Result;
    displayName?: string;
};
export declare function task(fn: TaskFunction): TaskFunction<Promise<void>>;
export declare function sequence(...tasks: TaskFunction[]): TaskFunction<Promise<void>>;
