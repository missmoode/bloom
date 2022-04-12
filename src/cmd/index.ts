import { existsSync, readFileSync } from 'fs';
import { Argument, program } from 'commander';
import { Configuration, GetCommandLineOption, populateConfiguration } from './config';
import path from 'path';
import { Targets, build, Context } from './build';

const bloomPackageFile = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString('utf-8'));
const implPackageFile = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json')).toString('utf-8'));

const partials: Partial<Configuration>[] = [];
if (existsSync(path.join(process.cwd(), 'bloom.json'))) {
  partials.push(JSON.parse(readFileSync(path.join(process.cwd(), 'bloom.json')).toString('utf-8')));
}
if (implPackageFile.bloom) {
  partials.push(implPackageFile.bloom);
}
const config = populateConfiguration(...partials);



const main = program
  .name(bloomPackageFile.name)
  .description('Command-line tool for building a Bloom game')
  .version(bloomPackageFile.version)
  .addArgument(new Argument('<target>', 'Selects the target to build for').choices(Targets))
  .addOption(GetCommandLineOption(config, 'build.bundle.main', '-i --main'))
  .addOption(GetCommandLineOption(config, 'build.out', '-o --out'))
  .addOption(GetCommandLineOption(config, 'build.bundle.minify', '-m --minify'))
  .addOption(GetCommandLineOption(config, 'build.bundle.sourcemaps', '-s --sourcemaps'))
  .action(async (target) => {
    try {
      await build(target).run(new Context(config));
    } catch (err) {
      console.log('Build failed.');
      throw err;
    }
  });

program.parse(process.argv);
program.exitOverride((err) => {
  console.error(err);
  process.exit(0);
});