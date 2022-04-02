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

function list(directory: string): string[] {
  const files = readdirSync(directory);
  const result = [];
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (!statSync(fullPath).isDirectory()) {
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

export function Web(config: Config) {
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

  const copyResources = src(config.resources);

  const html = src(`${__dirname}${path.sep}index.html`)
  .pipe(template({title: config.name, icon: `${path.basename(config.icon).replace('svg', 'png')}`, theme_color: config.themeColor}, {interpolate: /{{([\s\S]+?)}}/gs}))

  const icon = src(config.icon);

  const iconPNG = rasterize(config.icon, 512)

  const icons = [
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

  const manifest = src(`${__dirname}${path.sep}manifest.webmanifest`)
  .pipe(template({ title: config.shortname ?? config.name, theme_color: config.themeColor, icons: JSON.stringify(icons) }, {interpolate: /{{(.+?)}}/gs}))

  return merge2(bundle, copyResources, html, icon, iconPNG, manifest).pipe(dest(config.out));
}

export function ServiceWorker(config: Config) {
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