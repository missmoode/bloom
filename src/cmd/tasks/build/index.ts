import { Listr, ListrTaskWrapper } from 'listr2';
import { Context } from '../context';
import { prepareAssets } from './assets';
import { bundle } from './bundle';
import * as pwa from './pwa';
import { verify } from './verify';

export { bundle } from './bundle';
export { prepareAssets } from './assets';

export const build = {
  title: 'Build',
  task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr =>
    task.newListr([
      verify,
      {
        task: (context: Context, task: ListrTaskWrapper<Context, any>) => task.newListr([
          bundle,
          prepareAssets,
          pwa.generateWebManifest,
          pwa.copyHTML,
          pwa.copyServiceWorker
        ], { concurrent: false })
      }
    ], { concurrent: false })
};