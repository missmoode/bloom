import { ListrTask } from 'listr2';
import { join } from 'path';
import { dest } from 'vinyl-fs';
import { Context } from '../context';

export function output(dir?: string): ListrTask {
  return {
    title: 'Save to output',
    task: async (context: Context, task) => {
      const output = join(context.config.build.out as string, dir || '');
      task.output = `Saving to ${output}...`;
      const count = context.artefacts.count;
      await context.artefacts.flush.writeTo(dest(output));
      task.output = `Saved ${count} artefact${count === 1 ? '' : 's'} to ${output}`;
    }
  };
}