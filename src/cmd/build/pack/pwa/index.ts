import path from 'path';
import { PassThrough } from 'stream';
import Vinyl from 'vinyl';
import { ListrTask } from 'listr2';
import template from 'gulp-template';
import { src } from 'vinyl-fs';
import { Context } from '../../context';
import { TargetPreset } from '../target';

const icon = {
  title: 'Stage icon',
  task: async (context: Context) => {
    await context.artefacts.ingest(src(context.config.presentation.icon as string));
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
  task: async (context: Context) => {
    const manifest = {
      name: context.config.productName,
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

    await context.artefacts.ingest(manifestStream);
  }
};


const copyHTML = {
  title: 'Drop in HTML template',
  task: async (context: Context) => {
    const html = src(`${__dirname}${path.sep}index.html`)
      .pipe(template({ title: context.config.productName, favicon: './app_icon.png', touch_icon: './app_icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));

    await context.artefacts.ingest(html);
  }
};

const copyServiceWorker: ListrTask = {
  title: 'Drop in Service Worker template',
  task(context: Context) {
    const fileMap: Set<string> = new Set<string>();
    for (const file of context.artefacts) {
      if (file.relative.includes('.') && !fileMap.has(file.relative)) fileMap.add(file.relative);
    }
    const sw = src(`${__dirname}${path.sep}service-worker.js`)
      .pipe(template({ cache: JSON.stringify([...fileMap]), cache_name: `"${Date.now()}"` }, { interpolate: /'{{([\s\S]+?)}}'/gs }));

    return context.artefacts.ingest(sw);
  }
};

export const pwa: TargetPreset = {
  tasks: [icon, generateWebManifest, copyHTML, copyServiceWorker]
};