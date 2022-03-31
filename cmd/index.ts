#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { program } from 'commander';
import project from '../package.json';
import { Config, defaults } from './config';
import { Web } from './goals/web';
import { asPromise } from './goals/goal';
import { debug } from './util';
import path from 'path';
import { sync as rimraf } from 'rimraf';

program
  .name(project.version)
  .description(project.description)
  .version(project.version)
  .command('build')
  .description('Builds for web and PWA')
  .option('-c, --clean', 'delete the output directory before building')
  .option('-w, --web', 'build for web and PWA', true)
  .option('-p, --production', 'build without sourcemaps', false)
  .option('-c, --config <path>', 'configuration file to use instead of opts', './bloomConfig.json')
  .option('-o, --out, --outDirectory <path>', 'the directory to output to')
  .action(async (command) => {
    if (existsSync(command.config)) {
      const config = {...defaults, ...JSON.parse(readFileSync(command.config).toString('utf-8'))} as Config;
      config.production = command.production;
      if (command.outDirectory) config.outDir = command.outDirectory;
      config.outDir = path.join(process.cwd(), config.outDir);
      if (command.clean) {
        debug.info(`Deleting ${path.relative(process.cwd(), config.outDir)}${config.production ? '' : ' in three seconds'}...`);
        if (!config.production) await new Promise(resolve => setTimeout(resolve, 3000));
        rimraf(config.outDir)
        debug.success(`Done!`);
      }
      if (command.web) {
        debug.info('Building for web...');
        await asPromise(Web(config));
        debug.success('Done!');
      }
    } else {
      console.error('Missing bloom config.');
    }
  });

program.parse(process.argv);
program.exitOverride((err) => {
  console.log(err);
  process.exit(0);
})