import path from 'path';
import { PassThrough } from 'stream';
import Vinyl from 'vinyl';
import { Listr, ListrTask, ListrTaskWrapper } from 'listr2';
import template from 'gulp-template';
import { src } from 'vinyl-fs';
import { Context } from '../../context';
import tap from 'gulp-tap';
import { PlatformPreset } from '../platform';

const icon = {
  title: 'Stage icon',
  task: async (context: Context) => {
    context.pour(src(context.config.presentation.icon as string), 'dest');
  }
};

// write json object to vinyl file
function writeJson(obj: object, fileName: string) {
  const file = new Vinyl({
    contents: Buffer.from(JSON.stringify(obj)),
    path: fileName
  });
  return file;
}

const generateWebManifest = {
  title: 'Generate Web Manifest',
  task: (context: Context) => {
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

    return context.pour(manifestStream, 'dest');
  }
};


const copyHTML = {
  title: 'Drop in HTML template',
  task: (context: Context) => {
    const html = src(`${__dirname}${path.sep}index.html`)
      .pipe(template({ title: context.config.name, favicon: './app_icon.png', touch_icon: './app_icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));

    return context.pour(html, 'dest');
  }
};

const copyServiceWorker: ListrTask = {
  title: 'Generate File-Aware Service Worker',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task(context: Context, task: ListrTaskWrapper<Context, any>): Listr {
    return task.newListr([
      {
        title: 'Scan file tree',
        task(context: Context) {
          const files = context.serve('dest').pipe(tap((file) => {
            if (file.relative.includes('.')) (context.data.fileMap ??= new Array<string>()).push(file.relative);
          }));
          return context.pour(files, 'dest');    
        }
      },
      {
        title: 'Drop in Service Worker template',
        task(context) {
          const sw = src(`${__dirname}${path.sep}service-worker.js`)
            .pipe(template({ cache: JSON.stringify(context.data.fileMap), cache_name: `"${Date.now()}"` }, { interpolate: /'{{([\s\S]+?)}}'/gs }));
    
          return context.pour(sw, 'dest');
        }
      }
    ]);
  },
  options: { bottomBar: Infinity }
};

export const pwa: PlatformPreset = {
  tasks: [icon, generateWebManifest, copyHTML, copyServiceWorker]
};