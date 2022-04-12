import { ListrTask } from 'listr2';
import { Context } from '../context';

export type TargetPreset = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasks: ListrTask<Context, any>[];
};

import { pwa } from './pwa';

export const Targets = { pwa } as const;
// a string literal made of all of the keys of Targets
// For example, if Targets is [pwa: [], web: []] then Target is 'pwa' | 'web'
export type Target = keyof typeof Targets;
export const TargetNames = Object.keys(Targets);