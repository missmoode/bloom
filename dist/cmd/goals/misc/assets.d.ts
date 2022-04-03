/// <reference types="node" />
import { Config } from '../../config';
import { Logger } from '../../utils';
export declare function CopyAssets(log: Logger, config: Config): NodeJS.ReadWriteStream;
export declare function ProcureAppIcon(log: Logger, config: Config): NodeJS.ReadWriteStream;
export declare function GenerateFavicon(log: Logger, config: Config): NodeJS.ReadWriteStream;
