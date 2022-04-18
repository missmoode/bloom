import { Configuration } from '../config';
import Vinyl from 'vinyl';
import { Relay } from '../util/streams';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict<T = any> = { [key: string]: T };

export class Context {
  public readonly config: Configuration;
  public data: Dict = {};
  private readonly streams: Dict<Relay> = {};

  constructor(config: Configuration) {
    this.config = config;
  }

  public relay(key: string): Relay {
    return this.streams[key] ??= new Relay();
  }

  public get artefacts(): Relay<Vinyl> {
    return this.streams['artefacts'] ??= new Relay<Vinyl>();
  }

  public async clone(): Promise<Context> {
    const context = new Context(this.config);
    context.data = JSON.parse(JSON.stringify(this.data));
    for (const key in this.streams) {
      await this.relay(key).in.fill(this.streams[key].out);
    }
    return context;
  }
}