import { ListrTask } from 'listr2';
import { Configuration } from '../config';
import { Context } from './context';
export * from './build';
export declare function run(config: Configuration, ...tasks: ListrTask<Context, any>[]): Promise<Context>;
//# sourceMappingURL=index.d.ts.map