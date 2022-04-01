const levels = ['debug', 'info', 'warn', 'error'] as const;
type Level = typeof levels[number];

type status = "start" | "finish" | "notification";

type LogFunction = (message: string, premoji?: string) => void;

type Logger = {
  [loglevel in Level]: LogFunction;
} & {
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

      return lines.map((line, index) => `${index == 0 ? '╭' : index == lines.length-1 ? '╰' : '│'} ${line}`)
      .map(content => messageToString({...message, content}))
      .join('\n');

    } else {

      return messageToString({...message, content: lines[0]});
    }
    
  } else {
    return `${message.premoji ? `${message.premoji}  ` : ''}${message.domain ? `${message.domain}  ` : ''}${message.content}`;
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
    createLogger: (subdomain) => createLogger(subdomain ? domain ?  `${domain}/${subdomain}` : subdomain : domain),
    ...funcs
  } as Logger;
}