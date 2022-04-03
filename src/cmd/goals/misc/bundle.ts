import { Config } from '../../config';
import rollup from '@rollup/stream';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { dest } from 'vinyl-fs';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import path from 'path';
import terser from 'gulp-terser';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'gulp-sourcemaps';
import { Logger } from '../../utils/logger';

export function Bundle(log: Logger, config: Config) {
  const babelConf = {
    extensions: ['.ts', '.js', '.json'],
    presets: ['@babel/preset-typescript', '@babel/preset-env'].map(require),
    babelHelpers: 'bundled',
    sourcemaps: config.applicationRoot
  };

  let bundle = rollup({
    input: config.applicationRoot,
    plugins: [resolve({ preferBuiltins: false, extensions: ['.ts', '.js', '.json'] }), commonjs(), babel(babelConf as RollupBabelInputPluginOptions)],
    output: {
      dir: config.out,
      sourcemap: !config.production,
      format: 'umd'
    }
  }).pipe(source('bundle.js'))
    .pipe(buffer());

  if (!config.production)
    bundle = bundle.pipe(sourcemaps.init({ loadMaps: true }));
  bundle = bundle.pipe(terser({ output: { comments: false }, compress: config.production, mangle: true }));
  if (!config.production)
    bundle = bundle.pipe(sourcemaps.write('.', { sourceRoot: path.relative(config.out, path.dirname(config.applicationRoot)) }));

  return bundle.pipe(dest(config.out));
}
