/// <reference types="node" />
import { Config } from '../config';
import { Logger } from '../utils/logger';
declare type TaskFunction = {
    (log: Logger, config: Config): NodeJS.ReadWriteStream | Promise<any>;
    displayName?: string;
};
declare type Task = {
    (log: Logger, config: Config): Promise<any>;
};
export declare function task(fn: TaskFunction): Task;
export declare function sequence(...tasks: Task[]): Task;
export {};
