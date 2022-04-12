import { Listr } from 'listr2';
import { getTaskList, Target } from './pack';
import { Context } from './context';


// Multiple task lists may have common tasks.
// Up until the task lists diverge, we only need to run the common tasks once.
// We can visualise this as a tree of tasks.
// The root of the tree is the common tasks.
// For example, if the task lists are [A, B, C, E, F], [A, B, C, D, E, F], and [A, B, Z, E, F], then the resulting tree is [A, B, [[C, [[E, F], [D, E, F]]], [Z, E, F]]]
// When the task lists diverge, we should give each subtree


export { Targets } from './pack';
export { Context } from './context';
export function build(target: Target) {
  return new Listr<Context>(
    getTaskList(target),
    { concurrent: false, rendererOptions: { collapse: false, showTimer: true } }
  );
}