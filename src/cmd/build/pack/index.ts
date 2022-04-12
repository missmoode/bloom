import { ListrTask } from 'listr2';
import { Target, Targets } from './target';

import { output } from '../common/output';
import { bundle } from '../common/bundle';
import { resources } from '../common/assets';

export function getTaskList(target: Target): ListrTask[] {
  return [
    bundle,
    resources,
    ...Targets[target].tasks,
    output()
  ];
}

export { Target, TargetNames as Targets } from './target';