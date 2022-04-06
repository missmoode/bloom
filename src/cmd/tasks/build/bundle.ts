import rollup from '@rollup/stream';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import path from 'path';
import terser from 'gulp-terser';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'gulp-sourcemaps';
import { ListrTaskWrapper } from 'listr2';
import { Context, stageFiles } from '../context';

export const bundle = {
  title: 'Bundle',
  task: (context: Context, task: ListrTaskWrapper<Context, any>) => {

    const babelConf = {
      extensions: ['.ts', '.js', '.json'],
      presets: ['@babel/preset-typescript', '@babel/preset-env'].map(require),
      babelHelpers: 'bundled',
      sourcemaps: context.config.build.bundle.sourcemaps ? context.config.build.bundle.main : undefined
    };
  
    let count = 0;

    let bundle = rollup({
      input: context.config.build.bundle.main as string,
      plugins: [
        resolve({ preferBuiltins: false, extensions: ['.json', '.ts', '.js'] }), 
        commonjs(), 
        babel(babelConf as RollupBabelInputPluginOptions),
        {
          name: 'listr-output',

          transform(code, id) {
            task.output = `Rolled up ${++count} files`;
            return code;
          }
        }
      ],
      output: {
        sourcemap: context.config.build.bundle.sourcemaps === true,
        format: 'umd'
      }
    }).pipe(source('bundle.js'))
      .pipe(buffer());
  
    if (context.config.build.bundle.sourcemaps === true)
      bundle = bundle.pipe(sourcemaps.init({ loadMaps: true }));
    if (context.config.build.bundle.minify === true) 
      bundle = bundle.pipe(terser({ output: { comments: false }, compress: true, mangle: true }));
    if (context.config.build.bundle.sourcemaps === true)
      bundle = bundle.pipe(sourcemaps.write('.', { sourceRoot: path.relative(context.config.build.out as string, path.dirname(context.config.build.bundle.main as string)) }));
  
    return stageFiles(context, bundle);
  }
};