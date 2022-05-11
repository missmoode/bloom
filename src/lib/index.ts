export * from './view';
export * from './utils';
export * from './resources';
export * from './helpers';
export * from './TaskSystem';

import { Loader } from 'pixi.js';
import { LoaderPlugins } from './plugins';
for (const Plugin of LoaderPlugins) {
  Loader.registerPlugin(new Plugin());
}
