import { existsSync, readFileSync } from 'fs';
import { program } from 'commander';
import { Configuration, populateConfiguration } from './config';
import path from 'path';
import { run, build } from './tasks';

const packageFile = JSON.parse(readFileSync(`${__dirname}/../../package.json`).toString('utf-8'));

let config: Configuration;
if (existsSync(path.join(process.cwd(), 'bloom.json'))) {
  config = populateConfiguration(JSON.parse(readFileSync(path.join(process.cwd(), 'bloom.json')).toString('utf-8')));
} else {
  config = populateConfiguration({});
}


const main = program
  .name(packageFile.name)
  .description(packageFile.description)
  .version(packageFile.version);

main.command('build')
  .description('Builds for web and PWA')
  .action(async (options) => {
    await run(config, build);
  });
  
program.parse(process.argv);
program.exitOverride((err) => {
  process.exit(0);
});