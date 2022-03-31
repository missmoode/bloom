#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { program } from 'commander';
import project from '../package.json';
import { Config, defaults } from './config';
import { Web } from './goals/web';
import { asPromise } from './goals/goal';

program
  .name(project.version)
  .description(project.description)
  .version(project.version)
  .command('build')
  .description('Builds for web and PWA')
  .option('-w, --web', 'Build for web and PWA', true)
  .option('-c, --config <path>', 'configuration file to use instead of opts', './bloomConfig.json')
  .action(async (command) => {
    if (existsSync(command.config)) {
      const config = {...defaults, ...JSON.parse(readFileSync(command.config).toString('utf-8'))} as Config;
      if (command.web) await asPromise(Web(config));
      console.log('Done!');
    } else {
      console.error('Missing bloom config.');
    }
  });

program.parse(process.argv);
program.exitOverride((err) => {
  console.log(err);
  process.exit(0);
})