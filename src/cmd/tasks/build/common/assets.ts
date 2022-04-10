import { ListrTaskWrapper } from 'listr2';
import { src } from 'vinyl-fs';
import { Context } from '../../context';

export const resources = {
  title: 'Stage resources',
  task(context: Context, task: ListrTaskWrapper<Context, any>) {
    return context.pour(src(context.config.build.assets.resources as string), 'dest');
  }
};