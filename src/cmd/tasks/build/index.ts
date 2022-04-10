import { Listr, ListrTaskWrapper } from 'listr2';
import { Platform, Platforms } from './platform';
import { resources } from './common/assets';

import { Context } from '../context';
import { bundle } from './common/bundle';
import { dest } from 'vinyl-fs';

export { bundle } from './common/bundle';

export const PlatformNames = Object.keys(Platforms);
export function build(platform?: Platform) {
  if (platform && !PlatformNames.includes(platform)) platform = undefined;
  return [
    {
      title: 'Select platform',
      task: async (context: Context, task: ListrTaskWrapper<Context, any>) => {
        return task.prompt({
          type: 'Select',
          message: 'Select platform',
          required: true,
          choices: PlatformNames,
          result: (result: string) => {
            platform = result as Platform;
          }
        });
      },
      enabled: () => !platform
    },
    {
      title: 'Build: ' + platform,
      task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr => {
        return task.newListr([
          bundle,
          resources,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...Platforms[platform!].tasks,
          {
            title: 'Copy to output',
            task: (context: Context, task: ListrTaskWrapper<Context, any>) => {
              return context.serve('dest').pipe(dest(context.config.build.out as string));
            }
          }
        ]);
      }
    }
  ];
}

export { Platform } from './platform';