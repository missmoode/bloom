import { constants } from 'fs';
import { access } from 'fs/promises';
import { Listr, ListrTaskWrapper } from 'listr2';
import { Context, Platforms } from '../context';

export const verify = {
  title: 'Verify build settings',
  task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr =>
    task.newListr((parent) => [
      {
        title: 'Check platform',
        task: async (context: Context, task: ListrTaskWrapper<Context, any>) => {
          if (!context.platform) {
            await task.prompt({
              type: 'Select',
              message: 'Select platform',
              required: true,
              choices: [...Platforms],
              result: (value) => {
                context.platform = value;
              }
            });
          }
          task.title = `Platform: ${context.platform}`;
        }
      },
      {
        title: 'Verify entry point',
        task: () => access(context.config.build.bundle.main as string, constants.F_OK),
      },
      {
        title: 'Verify icon exists',
        task: () => access(context.config.presentation.icon as string, constants.F_OK),
        enabled: (context) => context.platform === 'pwa'
      }
    ])
};