import { PassThrough, Readable, Writable } from 'stream';

type SinkFunction<T> = (chunk: T, encoding: string) => void;

export class Sink<T = any> extends Writable {
  private fn: SinkFunction<T>;
  constructor(fn: SinkFunction<T>) {
    super({ objectMode: true });
    this.fn = fn;
  }
  override _write(chunk: T, encoding: string, next: (error?: Error | null) => void): void {
    this.fn(chunk, encoding);
    next();
  }

  public fill(source: NodeJS.ReadableStream): Promise<void> {
    return new Promise((resolve, reject) => {
      // piping it through a passthrough because vinyl-buffer doesn't seem to finish constructing vinyl objects without this
      source = source.pipe(new PassThrough({ objectMode: true }));
      source.on('error', reject);
      source.on('end', resolve);
      source.pipe(this);
    });
  }
}
export class Source<T = any> extends Readable {
  public objects: T[];
  constructor(objects: T[]) {
    super({ objectMode: true });
    this.objects = objects;
  }
  override _read(): void {
    this.push(this.objects.shift() ?? null);
  }

  public writeTo(dest: NodeJS.WritableStream): Promise<void> {
    return new Promise((resolve, reject) => {
      this.on('error', reject);
      this.on('end', resolve);
      this.pipe(dest);
    });
  }
}

/**
 * A store for objects in an object stream
 * @template T the type of object to store
 */
export class Relay<T = any> implements Iterable<T> {
  private objects: T[] = [];
  
  /**
   * Exposes a new sink which can be used to add objects to the relay
   */
  public get in(): Sink<T> {
    return new Sink((chunk) => this.objects.push(chunk));
  }
  /**
   * Exposes a new source which can be used to read objects from the relay
   */
  public get out(): Source<T> {
    return new Source(JSON.parse(JSON.stringify(this.objects)));
  }
  /**
   * Empties the relay and exposes a final source with all the objects
   */
  public get flush(): Source<T> {
    const objects = this.objects;
    this.objects = [];
    return new Source(objects);
  }

  public async cycle(transform: NodeJS.ReadWriteStream): Promise<this> {
    await this.in.fill(this.flush.pipe(transform));
    return this;
  }

  [Symbol.iterator]() {
    return this.objects[Symbol.iterator]();
  }

  public get count(): number {
    return this.objects.length;
  }


  public ingest(source: NodeJS.ReadableStream): Promise<void> {
    return this.in.fill(source);
  }

  public writeTo(dest: NodeJS.WritableStream): Promise<void> {
    return this.out.writeTo(dest);
  }
}