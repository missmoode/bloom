import { Listr, ListrTask } from 'listr2';
import { Configuration } from '../config';
import { Context, Platform } from './context';

export * from './build';
export function run(config: Configuration, platform?: Platform, ...tasks: ListrTask<Context, any>[]) {
  return new Listr<Context>(tasks).run({ config, platform });
}