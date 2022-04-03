import merge2 from 'merge2';
import sharp from 'sharp';
import { PassThrough } from 'stream';
import { dest, src } from 'vinyl-fs';
import { Config } from '../../config';
import { Logger } from '../../utils';
import rename from 'gulp-rename';
import Vinyl from 'vinyl';

export function CopyAssets(log: Logger, config: Config) {
  return merge2(src(config.resources), src(config.icon)).pipe(dest(config.out));
}

export function ProcureAppIcon(log: Logger, config: Config) {
  if (!config.appIcon) {
    log.info('No app icon specified, generating one from the general icon.');
    const stream = new PassThrough({ objectMode: true });
    sharp(config.icon)
      .resize(409, 409)
      .png()
      .flatten({ background: config.themeColor })
      .extend({ top: 103, left: 103, right: 103, bottom: 103, background: config.themeColor })
      .toBuffer().then((b) => {
        stream.end(new Vinyl({
          contents: b,
          path: 'app_icon.png'
        }));
      });
    return stream.pipe(dest(config.out));
  } else {
    return src(config.appIcon).pipe(rename('app_icon.png')).pipe(dest(config.out));
  }
}
export function GenerateFavicon(log: Logger, config: Config) {
  const stream = new PassThrough({ objectMode: true });
  sharp(config.icon)
    .resize(32,32)
    .png()
    .toBuffer().then((b) => {
      stream.end(new Vinyl({
        contents: b,
        path: 'favicon.png'
      }));
    });
  return stream.pipe(dest(config.out));
}