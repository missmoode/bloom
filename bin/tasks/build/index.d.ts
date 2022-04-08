import { Listr, ListrTaskWrapper } from 'listr2';
import { Context } from '../context';
export { bundle } from './bundle';
export { prepareAssets } from './assets';
export declare const build: {
    title: string;
    task: (context: Context, task: ListrTaskWrapper<Context, any>) => Listr;
};
//# sourceMappingURL=index.d.ts.map