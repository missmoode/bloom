import { src } from 'vinyl-fs';
import { Context, stageFiles } from '../context';
import { Listr, ListrTaskWrapper } from 'listr2';

export const prepareAssets = {
  title: 'Prepare Assets',
  task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr =>
    task.newListr([
      {
        title: 'Stage resources',
        task: (context: Context, task: ListrTaskWrapper<Context, any>) => 
          stageFiles(context, src(context.config.build.assets.resources as string))
      },
      {
        title: 'Stage icon',
        task: async (context: Context, task: ListrTaskWrapper<Context, any>) => {
          stageFiles(context, src(context.config.presentation.icon as string));
        },
        enabled: (context) => context.platform === 'pwa'
      }
    ], { concurrent: true })
};