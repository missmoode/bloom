import { ListrTask } from 'listr2';
import { Configuration } from '../config';
import { Context, Platform } from './context';
export * from './build';
export declare function run(config: Configuration, platform?: Platform, ...tasks: ListrTask<Context, any>[]): Promise<Context>;
//# sourceMappingURL=index.d.ts.map