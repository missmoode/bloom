import { Config } from "../../config";

import rollup from '@rollup/stream';
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

import { dest, src } from 'vinyl-fs';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import merge2 from "merge2";
import template from "gulp-template";
import sharp from "sharp";
import path from "path";

export function Web(config: Config) {
  const babelConf = {
    extensions: ['.ts', '.js'],
    presets: ['@babel/plugin-typescript'],
    exclude: 'node_modules/**'
  }

  const bundle = rollup({
    input: config.rootScript,
    plugins: [babel(babelConf)],
    output: {
      dir: config.outDir
    }
  }).pipe(source("bundle.js"))
  .pipe(buffer());

  const copyResources = src(config.resources);

  const html = source(`${__dirname}/index.html`)
  .pipe(template({title: config.name, icon: `./${path.basename(config.iconSVGPath).replace('svg', 'png')}`}, {interpolate: /{{([\s\S]+?)}}/g}))

  const icon = src(config.iconSVGPath);

  const iconPNG = rasterize(config.iconSVGPath, 512)

  const icons = [
    {
      src: path.basename(config.iconSVGPath),
      sizes: 'any'
    },
    {
      src: `./${path.basename(config.iconSVGPath).replace('svg', 'png')}`,
      sizes: 'any'
    }
  ]

  const manifest = source(`${__dirname}/manifest.webmanifest`)
  .pipe(template({ title: config.shortname ?? config.name, theme_color: config.themeColor, icons: `icons: ${JSON.stringify(icons)}` }, {interpolate: /{{(.+?)}}/gs}))

  return merge2(bundle, copyResources, html, icon, iconPNG, manifest).pipe(dest(config.outDir));
}

function rasterize(input: string | Buffer, width: number, height = width) {
  return sharp(input)
    .resize(width, height)
    .png()
    .pipe(buffer())
}