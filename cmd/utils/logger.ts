import { Color, stripAnsi } from "./colors";

const levels = ['debug', 'info', 'warn', 'error'] as const;
type Level = typeof levels[number];

type status = "start" | "finish" | "notification";

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

      return lines.map((line, index) => `${Color.FgMagenta}${index == 0 ? '╭' : index == lines.length-1 ? '╰' : '│'}${Color.Reset} ${line}`)
      .map(content => messageToString({...message, content}))
      .join('\n');

    } else {

      return messageToString({...message, content: lines[0]});
    }
    
  } else {
    return `${pad(message.premoji ?? '◌', 3)}${Color.FgMagenta}${Color.Bright}${message.domain ? `${pad(message.domain, 23)}` : ''}  ${Color.Reset}${message.content}${Color.Reset}`;
  }
}

function log(level: Level, message: Message) {
  console[level](messageToString(message));
}

function createLogFunction(level: Level, domain?: string): LogFunction {
  return (content: string, premoji?: string) => {
    log(level, {domain: domain, content, premoji})
  };
}

export function createLogger(domain?: string): Logger {
  const funcs = levels
    .map(level => createLogFunction(level, domain))
    .reduce((prev, func, i) => ({...prev, [levels[i]]: func}), {});
  return {
    domain: domain,
    createLogger: (subdomain) => createLogger(subdomain ? domain ?  `${domain} » ${subdomain}` : subdomain : domain),
    ...funcs
  } as Logger;
}

// pad a string or restrict it to a certain length
// when restricting it, do so from the left and include an ellipsis, e.g. "foo" => "...foo"
// pad with spaces
function pad(str: string, length: number): string {
  if (str.length > length) {
    return `...${str.slice(-length+3)}`;
  } else {
    return `${str}${' '.repeat(length - str.length)}`;
  }
}