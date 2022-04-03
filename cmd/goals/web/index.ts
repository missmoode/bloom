import { Config } from "../../config";

import rollup from '@rollup/stream';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

import { dest, src } from 'vinyl-fs';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import merge2 from "merge2";
import template from "gulp-template";
import sharp from "sharp";
import path from "path";
import { PassThrough } from "stream";
import Vinyl from 'vinyl';
import terser from 'gulp-terser';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'gulp-sourcemaps';
import { readdirSync, statSync } from "fs";
import { Logger } from "../../utils/logger";
import { sequence, task } from "../../tasks";

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

function Bundle(log: Logger, config: Config) {
  const babelConf = {
    extensions: ['.ts', '.js', '.json'],
    presets: ['@babel/preset-typescript', '@babel/preset-env'],
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    sourcemaps: config.applicationRoot
  }

  let bundle = rollup({
    input: config.applicationRoot,
    plugins: [resolve({ preferBuiltins: false, extensions: ['.ts', '.js', '.json'] }), commonjs(), babel(babelConf as RollupBabelInputPluginOptions)],
    output: {
      dir: config.out,
      sourcemap: !config.production,
      format: 'umd'
    }
  }).pipe(source("bundle.js"))
  .pipe(buffer());

  if (!config.production) bundle = bundle.pipe(sourcemaps.init({loadMaps: true}))
  bundle = bundle.pipe(terser({output: {comments: false}}));
  if (!config.production) bundle = bundle.pipe(sourcemaps.write('.', { sourceRoot: path.relative(config.out, path.dirname(config.applicationRoot)) }));

  return bundle.pipe(dest(config.out));
}

export function Assets(log: Logger, config: Config) {
  return src(config.resources).pipe(dest(config.out));
}

// write json object to vinyl file
function writeJson(obj: any, fileName: string) {
  const file = new Vinyl({
    contents: Buffer.from(JSON.stringify(obj)),
    path: fileName
  });
  return file;
};

function WebManifest(log: Logger, config: Config) {
  const icon = src(config.icon);

  const iconPNG = rasterize(config.icon, 512)

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
        src: `${path.basename(config.icon).replace('svg', 'png')}`,
        sizes: '72x72 96x96 128x128 256x256 512x512',
        type: 'image/png'
      }
    ]
  };

	const manifestStream = new PassThrough({objectMode: true});
  manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));

  return merge2(icon, iconPNG, manifestStream).pipe(dest(config.out));
}

function HTML(log: Logger, config: Config) {
  const html = src(`${__dirname}${path.sep}index.html`)
  .pipe(template({title: config.name, icon: `${path.basename(config.icon).replace('svg', 'png')}`, theme_color: config.themeColor}, {interpolate: /{{([\s\S]+?)}}/gs}));
  return html.pipe(dest(config.out));
}

function ServiceWorker(log: Logger, config: Config) {
  return src(`${__dirname}${path.sep}service-worker.js`)
  .pipe(template({cache: JSON.stringify(mapFilesRecursive(config.out))}, {interpolate: /{{(.+?)}}/gs}))
  .pipe(dest(config.out));
}

function rasterize(input: string, width: number, height = width) {
	const stream = new PassThrough({objectMode: true});
  sharp(input)
    .resize(width, height)
    .png()
    .toBuffer().then((b) => {
        stream.end(new Vinyl({
          contents: b,
          path: path.basename(input).replace('svg', 'png')
        }));
      }
    ).catch((e)=>stream.emit('error', e));
	return stream as NodeJS.ReadWriteStream;
}

export const PWA = task(sequence(Bundle, Assets, WebManifest, HTML, ServiceWorker));