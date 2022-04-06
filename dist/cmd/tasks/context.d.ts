/// <reference types="node" />
import { Writable } from 'stream';
import { Configuration } from '../config';
export declare const Platforms: readonly ["web", "pwa"];
export declare type Platform = typeof Platforms[number];
declare type Dict<T = any> = {
    [key: string]: T;
};
export declare type Context = Dict & {
    config: Configuration;
    platform?: Platform;
    destination?: Writable;
};
export declare function stageFiles(context: Context, vinylStream: NodeJS.ReadableStream): Promise<void>;
export {};
//# sourceMappingURL=context.d.ts.map