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
import { Context } from '../context';


export const bundle = {
  title: 'Create bundle',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: (context: Context, task: ListrTaskWrapper<Context, any>): Listr =>
    task.newListr([
      {
        title: 'Condense source',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        task: async (context: Context, btask: ListrTaskWrapper<Context, any>) => {
          const babelConf: RollupBabelInputPluginOptions = {
            extensions: ['.ts', '.js'],
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
            babelrc: false,
            babelHelpers: 'bundled'
          };
      
          let count = 0;
    
          const bundle = rollup({
            input: context.config.build.bundle.main as string,
            cache: context.data.rollupCache ??= {},
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

          await context.relay('bundle').ingest(bundle);
        },
        options: { bottomBar: Infinity, persistentOutput: true }
      },
      {
        title: 'Compress bundle',
        task: async (context: Context) => {
          const bundle = context.relay('bundle');
          task.output = 'Compressing...';
          if (context.config.build.bundle.sourcemaps === true)
            await bundle.cycle(sourcemaps.init({ loadMaps: true }));
          await bundle.cycle(terser({ output: { comments: false }, compress: true, mangle: { properties: false } }));
          if (context.config.build.bundle.sourcemaps === true)
            await bundle.cycle(sourcemaps.write('.', { sourceRoot: path.relative(context.config.build.out as string, path.dirname(context.config.build.bundle.main as string)) }));
        },
        enabled: (context) => context.config.build.bundle.minify === true
      },
      {
        task: async (context: Context) => {
          task.output = 'Copying to artefacts...';
          await context.artefacts.ingest(context.relay('bundle').flush);
          task.output = 'Done!';
        }
      }
    ], { concurrent: false, rendererOptions: { collapse: false } })
};