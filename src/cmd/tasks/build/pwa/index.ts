import path from 'path';
import { PassThrough } from 'stream';
import Vinyl from 'vinyl';
import { Context, stageFiles } from '../../context';
import { ListrTaskWrapper } from 'listr2';
import template from 'gulp-template';
import { src } from 'vinyl-fs';
import { readdirSync, statSync } from 'fs';

// write json object to vinyl file
function writeJson(obj: any, fileName: string) {
  const file = new Vinyl({
    contents: Buffer.from(JSON.stringify(obj)),
    path: fileName
  });
  return file;
}

export const generateWebManifest = {
  title: 'Generate Web Manifest (PWA)',
  task: (context: Context, task: ListrTaskWrapper<Context, any>) => {
    const manifest = {
      name: context.config.name,
      background_color: context.config.presentation.themeColor,
      theme_color: context.config.presentation.themeColor,
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: path.basename(context.config.presentation.icon),
          sizes: 'any',
          type: 'image/svg'
        },
        {
          src: 'app_icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    };

    const manifestStream = new PassThrough({ objectMode: true });
    manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));

    return stageFiles(context, manifestStream);
  },
  enabled: (context: Context) => context.platform === 'pwa'
};

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


export const copyHTML = {
  title: 'Drop in HTML template (PWA)',
  task: (context: Context, task: ListrTaskWrapper<Context, any>) => {
    const html = src(`${__dirname}${path.sep}service-worker.js`)
      .pipe(template({ title: context.config.name, favicon: './favicon.png', touch_icon: './touch-icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));

    return stageFiles(context, html);
  },
  enabled: (context: Context) => context.platform === 'pwa'
};

export const copyServiceWorker = {
  title: 'Drop in Service Worker template (PWA)',
  task: (context: Context, task: ListrTaskWrapper<Context, any>) => {
    const sw = src(`${__dirname}${path.sep}service-worker.js`)
      .pipe(template({ cache: JSON.stringify(mapFilesRecursive(context.config.build.out as string)), cache_name: `"${Date.now()}"` }, { interpolate: /'{{([\s\S]+?)}}'/gs }));

    return stageFiles(context, sw);
  },
  enabled: (context: Context) => context.platform === 'pwa'
};