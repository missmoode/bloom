/// <reference types="node" />
import { Config } from "../config";
export declare type Goal = (config: Config) => NodeJS.ReadWriteStream;
export declare function asPromise(stream: NodeJS.ReadWriteStream): Promise<void>;
export * from './web';
