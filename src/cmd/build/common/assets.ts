import { src } from 'vinyl-fs';
import { Context } from '../context';

export const resources = {
  title: 'Stage resources',
  task(context: Context) {
    return context.artefacts.in.fill(src(context.config.build.assets.resources as string));
  }
};