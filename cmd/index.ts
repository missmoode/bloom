import { readFileSync, existsSync } from 'fs';
import { program } from 'commander';
import project from '../package.json';
import { resolve as resolveConfig } from './config';
import { PWA } from './goals';
import path from 'path';
import { sync as rimraf } from 'rimraf';
import { createLogger } from './utils/logger';

const main = program
  .name(project.version)
  .description(project.description)
  .version(project.version)

const build = main.command('build')
  .description('Builds for web and PWA')
  .option('--config <path>', 'configuration file to use', './bloomConfig.json')
  .option('-c, --clean', 'delete the output directory before building')
  .option('-p, --production', 'build without sourcemaps', false)
  .option('-o, --out <path>', 'the directory to output to', 'web')
  .action(async (options) => {
    const config = resolveConfig(options);
    let l = createLogger('clean')
    if (options.clean && existsSync(options.out)) {
      l.info('Cleaning last build...', '🧹');
      rimraf(options.out);
      l.info('Done!', '✨');
    }
    l = createLogger();
    l.info('Building PWA...', '🌷');
    await PWA(l, config);
    l.info('Done!', '🌸');
  });

program.parse(process.argv);
program.exitOverride((err) => {
  console.log(err);
  process.exit(0);
})