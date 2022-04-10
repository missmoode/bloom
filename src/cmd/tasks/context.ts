import { PassThrough } from 'stream';
import { Configuration } from '../config';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict<T = any> = { [key: string]: T };

export class Context {
  public readonly config: Configuration;
  public readonly data: Dict<any> = {};
  private readonly streams: Dict<NodeJS.ReadWriteStream> = {};

  constructor(config: Configuration) {
    this.config = config;
  }

  public pour(from: NodeJS.ReadableStream, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      from.on('error', reject);
      from.on('end', resolve);
      from.pipe(new PassThrough({ objectMode: true })).pipe((this.streams[key] ??= new PassThrough({ objectMode: true })), { end: false });
    });
  }

  public serve(key: string): NodeJS.ReadableStream {
    const value = this.streams[key];
    delete this.streams[key];
    return value.end();
  }
}

function isWritableStream(stream: object): stream is NodeJS.WritableStream {
  return typeof (stream as NodeJS.WritableStream).write === 'function';
}

function isReadableStream(stream: object): stream is NodeJS.ReadableStream {
  return typeof (stream as NodeJS.ReadableStream).pipe === 'function';
}