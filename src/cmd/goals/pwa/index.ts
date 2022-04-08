import { Config } from '../../config';


import { dest, src } from 'vinyl-fs';
import template from 'gulp-template';
import path from 'path';
import { readdirSync, statSync } from 'fs';
import { Logger } from '../../utils/logger';
import { sequence, task } from '../../tasks';
import { Bundle, GenerateFavicon, ProcureAppIcon } from '../misc';
import { CopyAssets } from '../misc';
import { WebManifest } from '../../tasks/build/pwa/webmanifest';

function list(directory: string): string[] {
  const files = readdirSync(directory);
  const result = [];
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (statSync(fullPath).isDirectory()) {
      result.push(...list(fullPath));
    } else {
      result.push(fullPath);
    }
  }
  return result;
}

// from a list of files and directories
// add a trailing slash for each directory
// and return a list of files
function mapFilesRecursive(base: string): string[] {
  const files = list(base);
  const result = [];
  for (const file of files) {
    if (statSync(file).isDirectory()) {
      result.push(`/${path.relative(base, file)}/`.replace('//', '/'));
    } else {
      result.push(`/${path.relative(base, file)}`);
    }
  }
  result.push('/');
  return result;
}

function HTML(log: Logger, config: Config) {
  const html = src(`${__dirname}${path.sep}index.html`)
    .pipe(template({ title: config.name, favicon: './favicon.png', touch_icon: './touch-icon.png', theme_color: config.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
  return html.pipe(dest(config.out));
}

function ServiceWorker(log: Logger, config: Config) {
  return src(`${__dirname}${path.sep}service-worker.js`)
    .pipe(template({ cache: JSON.stringify(mapFilesRecursive(config.out)) }, { interpolate: /\/\*{{(.+?)}}\*\//gs }))
    .pipe(dest(config.out));
}

export const PWA = task(sequence(Bundle, CopyAssets, ProcureAppIcon, GenerateFavicon, WebManifest, HTML, ServiceWorker));