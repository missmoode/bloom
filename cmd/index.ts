import { readFileSync, existsSync } from 'fs';
import { program } from 'commander';
import project from '../package.json';
import { resolve as resolveConfig } from './config';
import { Web } from './goals/web';
import { asPromise } from './goals/goal';
import path from 'path';
import { sync as rimraf } from 'rimraf';
import { createLogger } from './logger';

const main = program
  .name(project.version)
  .description(project.description)
  .version(project.version)

const build = main.command('build')
  .description('Builds for web and PWA')
  .option('-c, --config <path>', 'configuration file to use', './bloomConfig.json')
  .option('-c, --clean', 'delete the output directory before building')
  .option('-p, --production', 'build without sourcemaps', false)
  .option('-o, --out <path>', 'the directory to output to', 'dist')
  .action(async (options) => {
    const config = resolveConfig(options);
    const l = createLogger('build')
    l.info('Building for web...', '🌷');
    await asPromise(Web(config));
    l.info('Done!', '🌸');
  });

program.parse(process.argv);
program.exitOverride((err) => {
  console.log(err);
  process.exit(0);
})