import { Writable } from 'stream';
import { dest } from 'vinyl-fs';
import { Configuration } from '../config';

export const Platforms = ['web', 'pwa'] as const;
export type Platform = typeof Platforms[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict<T = any> = { [key: string]: T };

export type Context = Dict & {
  config: Configuration,
  platform?: Platform,
  destination?: Writable,
}


export function stageFiles(context: Context, vinylStream: NodeJS.ReadableStream) {
  return new Promise<void>((resolve, reject) => {
    vinylStream.on('end', resolve);
    vinylStream.on('error', reject);
    vinylStream.pipe(context.fileStage ??= dest(context.config.build.out as string), { end: false });
  });
}