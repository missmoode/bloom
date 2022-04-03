import path from 'path';
import { PassThrough } from 'stream';
import { dest } from 'vinyl-fs';
import { Config } from '../../config';
import { Logger } from '../../utils';
import Vinyl from 'vinyl';

// write json object to vinyl file
function writeJson(obj: any, fileName: string) {
  const file = new Vinyl({
    contents: Buffer.from(JSON.stringify(obj)),
    path: fileName
  });
  return file;
}

export function WebManifest(log: Logger, config: Config) {
  const manifest = {
    name: config.name,
    short_name: config.name,
    description: config.description,
    background_color: config.themeColor,
    theme_color: config.themeColor,
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    icons: [
      {
        src: path.basename(config.icon),
        sizes: 'any',
        type: 'image/svg'
      },
      {
        src: 'app_icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: "maskable"
      }
    ]
  };

  const manifestStream = new PassThrough({ objectMode: true });
  manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));

  return manifestStream.pipe(dest(config.out));
}
