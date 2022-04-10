import { ListrTask } from 'listr2';
import { Context } from '../context';

export type PlatformPreset = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasks: ListrTask<Context, any>[];
};

import { pwa } from './pwa';

export const Platforms = { pwa } as const;
// a string literal made of all of the keys of Platforms
// For example, if Platforms is [pwa: {}, web: {}] then Platform is 'pwa' | 'web'
export type Platform = keyof typeof Platforms;