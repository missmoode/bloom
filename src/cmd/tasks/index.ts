import { Listr } from 'listr2';
import { Configuration } from '../config';
import { build } from './build';
import { Platform } from './build/platform';
import { Context } from './context';

export { Platform } from './build';
export function run(config: Configuration, platform?: Platform) {
  return new Listr<Context>(build(platform), { rendererOptions: { showTimer: true } }).run(new Context(config));
}