import { Context } from '../../context';
import { ListrTaskWrapper } from 'listr2';
export declare const generateWebManifest: {
    title: string;
    task: (context: Context, task: ListrTaskWrapper<Context, any>) => Promise<void>;
    enabled: (context: Context) => boolean;
};
export declare const copyHTML: {
    title: string;
    task: (context: Context, task: ListrTaskWrapper<Context, any>) => Promise<void>;
    enabled: (context: Context) => boolean;
};
export declare const copyServiceWorker: {
    title: string;
    task: (context: Context, task: ListrTaskWrapper<Context, any>) => Promise<void>;
    enabled: (context: Context) => boolean;
};
//# sourceMappingURL=index.d.ts.map