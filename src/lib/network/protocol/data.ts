import { Buffer } from 'buffer';
import { LinkedList } from '../../utils';

export interface BufferWriter {
  writeRaw(data: WithImplicitCoercion<Uint8Array | ReadonlyArray<number>>): void;
  write<T>(codec: Codec<T>, object: T): void;
}

export class BufferConcatenator implements BufferWriter {
  private bufferChain: LinkedList<Buffer> = new LinkedList();
  
  public writeRaw(data: WithImplicitCoercion<Uint8Array | ReadonlyArray<number>>): void {
    if (Buffer.isBuffer(data)) {
      this.bufferChain.push(data);
    } else {
      this.bufferChain.push(Buffer.from(data));
    }
  }

  public write<T>(codec: Codec<T>, object: T): void {
    codec.encode(object, this);
  }

  public finish(): Buffer {
    return Buffer.concat(this.bufferChain.toArray(), this.bufferChain.length);
  }
}

/*
 * Buffer Reader for reading data from a buffer. Has a function to read a set number of bytes.
 */
export class BufferReader {
  private buffer: Buffer;
  private offset: number;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  public readRaw(bytes: number): Buffer {
    const out = this.buffer.slice(this.offset, this.offset + bytes);
    this.offset += bytes;
    return out;
  }

  public read<T>(codec: Codec<T>): T {
    return codec.decode(this);
  }
}

export type Codec<T> = {
  encode(object: T, buf: BufferWriter): void;
  decode(data: BufferReader): T;
};
