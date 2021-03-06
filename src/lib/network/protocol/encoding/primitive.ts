import { BufferReader, BufferWriter, NetworkCodec } from './data';

export const Boolean: NetworkCodec<boolean> = {
  encode: (data: boolean, buf: BufferWriter) => {
    buf.writeRaw([data ? 1 : 0]);
  }, 
  decode: (data: BufferReader) => {
    return data.readRaw(1)[0] === 1;
  }
};

export const UByte: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(1);
    b.writeUInt8(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(1).readUInt8();
  }
};

export const Byte: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(1);
    b.writeInt8(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(1).readInt8();
  }
};

export const UShort: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(2);
    b.writeUint16BE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(2).readUInt16BE();
  }
};

export const Short: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(2);
    b.writeInt16BE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(2).readInt16BE();
  }
};

export const UInt: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(4);
    b.writeUint32BE(data, 0);
    buf.writeRaw(b);
  }, 
  decode: (data: BufferReader) => {
    return data.readRaw(4).readUInt32BE();
  } 
};

export const Int: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(4);
    b.writeInt32BE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(4).readInt32BE();
  }
};

export const UBigInt: NetworkCodec<bigint> = {
  encode: (data: bigint, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(8);
    b.writeBigUInt64BE(data, 0);
    buf.writeRaw(b);
  }, 
  decode: (data: BufferReader) => {
    return data.readRaw(8).readBigUint64BE();
  }
};

export const BigInt: NetworkCodec<bigint> = {
  encode: (data: bigint, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(8);
    b.writeBigInt64BE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(8).readBigInt64BE();
  }
};

export const Float: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(4);
    b.writeFloatBE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(4).readFloatBE();
  }
};

export const Double: NetworkCodec<number> = {
  encode: (data: number, buf: BufferWriter) => {
    const b = Buffer.allocUnsafe(8);
    b.writeDoubleBE(data, 0);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    return data.readRaw(8).readDoubleBE();
  }
};

export const String: NetworkCodec<string> = {
  encode: (data: string, buf: BufferWriter) => {
    const b = Buffer.from(data, 'utf8');
    buf.write(Int, b.byteLength);
    buf.writeRaw(b);
  },
  decode: (data: BufferReader) => {
    const length = data.read(Int);
    return data.readRaw(length).toString('utf8');
  }
};