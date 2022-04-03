/// <reference types="node" />
import { Config } from '../../config';
import { Logger } from '../../utils/logger';
export declare function Assets(log: Logger, config: Config): NodeJS.ReadWriteStream;
export declare const PWA: import("../../tasks").TaskFunction<Promise<void>>;
