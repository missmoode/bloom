import { Listr, ListrTask } from 'listr2';
import { Configuration } from '../config';
import { Context } from './context';

export * from './build';
export function run(config: Configuration, ...tasks: ListrTask<Context, any>[]) {
  return new Listr<Context>(tasks).run({ config });
}