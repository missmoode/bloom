import { Command } from "commander";
import { existsSync, readFileSync } from "fs"
import { basename, dirname, extname } from "path";
import { createLogger } from './logger';

const logger = createLogger("config");

export type Config = {
  name: string,
  shortname?: string,
  description?: string,
  icon: string,
  applicationRoot: string,
  resources: string | string[],
  themeColor: string,
  out: string,
  production: boolean
}

export function resolve(options: any): Config {
  let config: Partial<Config> = {...options};
  if (existsSync(options.config)) {
    config = {...config, ...JSON.parse(readFileSync(options.config).toString('utf-8'))} as Partial<Config>;
  }

  return inferMissing(config);
}

function inferMissing(input: Partial<Config>): Config {
  const config: Partial<Config> = {...input};

  if (existsSync('package.json')) {
    const packageFile = JSON.parse(readFileSync('package.json').toString('utf-8'));
    if (!config.name && packageFile.name) {
      config.name = packageFile.name.replace(/([-_])/g, ' ').replace(/((?<=^|\s)[\S])/g, (s: string) => s.toUpperCase());
      logger.debug(`Inferred name "${config.name}" from package.json`, '💡');
    }
    if (!config.description && packageFile.description) {
      config.description = packageFile.description;
      logger.debug(`Inferred description from package.json`, '💡');
    }
    if (!config.applicationRoot && packageFile.main && (packageFile.main as string).endsWith('.ts')) {
      config.applicationRoot = packageFile.main;
      logger.debug(`Inferred application root from package.json`, '💡');
    }
    if (!config.icon && packageFile.icon) {
      config.icon = packageFile.icon;
      logger.debug(`Using inferred icon from package.json`, '💡');
    }
    if (!config.themeColor && packageFile.themeColor) {
      config.themeColor = packageFile.themeColor;
      logger.debug(`Using theme color from package.json`, '💡');
    }
    if (!config.resources && packageFile.resources) {
      config.resources = packageFile.resources;
      logger.debug(`Using resources from package.json`, '💡');
    }
  }

  if (!config.name) {
    config.name = basename(process.cwd());
    logger.warn(`Inferred name "${config.name}" from process directory name`, '💡');
  }
  if (!config.themeColor) {
    logger.warn('No theme color specified: defaulting to white', '❔');
    config.themeColor = 'white';
  }
  if (config.icon) {
    if(extname(config.icon) !== '.svg') {
      logger.error('Icon path must end with .svg', '❌');
      config.icon = undefined;
    } else if (!existsSync(config.icon)) {
      logger.error('Icon file not found', '❌');
      config.icon = undefined;
    }
  } else {
    logger.error('Missing icon path', '❌');
  }
  if (!config.resources) {
    logger.error('Missing resources globs', '❌');
  }
  if (!config.resources || !config.icon) {
    process.exit(1);
  }
  return config as Config;
}