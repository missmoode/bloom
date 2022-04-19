import { Loader } from 'pixi.js';
import { Plugins } from './plugins';
for (const Plugin of Plugins) {
  Loader.registerPlugin(new Plugin());
}

export * as Resourceful from './resourceful';