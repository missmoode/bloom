import rollup from '@rollup/stream';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import path from 'path';
import terser from 'gulp-terser';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import sourcemaps from 'gulp-sourcemaps';
import { Listr, ListrTaskWrapper } from 'listr2';
import { Context } from '../../context';


export const bundle = {
  title: 'Create bundle',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr =>
    task.newListr([
      {
        title: 'Condense source',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        task: (context: Context, btask: ListrTaskWrapper<Context, any>) => {
          const babelConf = {
            extensions: ['.ts', '.js'],
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
            babelrc: false,
            babelHelpers: 'bundled',
          };
      
          let count = 0;
    
          const bundle = rollup({
            input: context.config.build.bundle.main as string,
            plugins: [
              resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.json', '.mjs', '.cjs'], moduleDirectories: ['node_modules'] }), 
              json(),
              commonjs(), 
              babel(babelConf as RollupBabelInputPluginOptions),
              {
                name: 'listr-output',
    
                transform(code) {
                  task.output = `Condensing... (${++count} file${count === 1 ? '' : 's'})`;
                  return { code, map: null };
                }
              }
            ],
            onwarn(warning) {
              btask.stdout().write(warning.message + '\n');
            },
            output: {
              minifyInternalExports: false,
              sourcemap: context.config.build.bundle.sourcemaps === true,
              format: 'iife',
            }
          }).pipe(source('bundle.js'))
            .pipe(buffer());

          return context.pour(bundle, 'bundle');
        },
        options: { bottomBar: Infinity, persistentOutput: true }
      },
      {
        title: 'Compress bundle',
        task: (context: Context) => {
          let bundle = context.serve('bundle');
          task.output = 'Compressing...';
          if (context.config.build.bundle.sourcemaps === true)
            bundle = bundle.pipe(sourcemaps.init({ loadMaps: true }));
          bundle = bundle.pipe(terser({ output: { comments: false }, compress: true, mangle: true }));
          if (context.config.build.bundle.sourcemaps === true)
            bundle = bundle.pipe(sourcemaps.write('.', { sourceRoot: path.relative(context.config.build.out as string, path.dirname(context.config.build.bundle.main as string)) }));
          return context.pour(bundle, 'bundle');
        },
        enabled: (context) => context.config.build.bundle.minify === true
      },
      {
        task: (context: Context) => {
          task.output = 'Done!';
          context.pour(context.serve('bundle'), 'dest');
        }
      }
    ], { concurrent: false, rendererOptions: { collapse: false } })
};