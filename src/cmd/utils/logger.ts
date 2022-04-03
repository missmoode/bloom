import { pad } from './misc';
import chalk from 'chalk';


const levels = ['debug', 'info', 'warn', 'error'] as const;
type Level = typeof levels[number];

type LogFunction = (message: string, premoji?: string) => void;

export type Logger = {
  [loglevel in Level]: LogFunction;
} & {
  domain?: string
  createLogger: typeof createLogger;
};

type Message = {
  premoji?: string,
  domain?: string,
  content: string
}

function messageToString(message: Message): string {
  if (message.content.includes('\n')) {
    const lines = message.content.split('\n')
      .filter((s, i, a) => s.length > 0 || i < a.length-1);

    if (lines.length > 1) {

      return lines.map((line, index) => `${chalk.yellow(index == 0 ? '╭' : index == lines.length-1 ? '╰' : '│')} ${line}`)
        .map(content => messageToString({ ...message, content }))
        .join('\n');

    } else {

      return messageToString({ ...message, content: lines[0] });
    }
    
  } else {
    return `${pad(message.premoji ?? '◌', 3)}${formatDomain(message.domain)} ${chalk.yellowBright.bold('│')} ${message.content}`;
  }
}

function log(level: Level, message: Message) {
  console[level](messageToString(message));
}

function createLogFunction(level: Level, domain?: string): LogFunction {
  return (content: string, premoji?: string) => {
    log(level, { domain: domain, content, premoji });
  };
}


function formatDomain(domain?: string, length = 16) {
  let str = pad(domain, length, true);
  if (domain) {
    const split = str.lastIndexOf('»');
    if (split>-1) {
      str = chalk.magenta.bold(str.slice(0, split)) + chalk.magentaBright.bold(str.slice(split));
    } else {
      str = chalk.magentaBright.bold(str);
    }
    str.replace(/» /g, chalk.gray('»'));
    str.replace(/../g, chalk.gray('..'));
  }
  return str;
}

export function createLogger(domain?: string): Logger {
  const funcs = levels
    .map(level => createLogFunction(level, domain))
    .reduce((prev, func, i) => ({ ...prev, [levels[i]]: func }), {});
  return {
    domain: domain,
    createLogger: (subdomain) => createLogger(subdomain ? domain ?  `${domain}»${subdomain}` : subdomain : domain),
    ...funcs
  } as Logger;
}