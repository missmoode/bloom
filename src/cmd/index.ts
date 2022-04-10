import { existsSync, readFileSync } from 'fs';
import { Option, program } from 'commander';
import { Configuration, GetCommandLineOption, populateConfiguration } from './config';
import path from 'path';
import { run } from './tasks';
import { PlatformNames } from './tasks/build';

const packageFile = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString('utf-8'));

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
  .description('Builds the game and places it in the output directory.')
  .addOption(new Option('-p, --platform <platform>', 'Selects the platform to build for').choices(PlatformNames))
  .addOption(GetCommandLineOption(config, 'build.bundle.main', '-i --main'))
  .addOption(GetCommandLineOption(config, 'build.out', '-o --out'))
  .addOption(GetCommandLineOption(config, 'build.bundle.minify', '-m --minify'))
  .addOption(GetCommandLineOption(config, 'build.bundle.sourcemaps', '-s --sourcemaps'))
  .action(async (options) => {
    try {
      await run(config, options.platform);
    } catch{
      console.log('Build failed.');
      process.exit(1);
    }
  });

program.parse(process.argv);
program.exitOverride((err) => {
  process.exit(0);
});