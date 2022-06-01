import { Buffer } from 'buffer';
import { LinkedList } from '../../utils';

/*
  We need a protocol for converting between data types and binary data.
  Aims to balance:
    - Make the result as small as possible
    - Make the conversion process as performant as possible
    - Easily extendable
    - Easy to use
*/
/*
  The aim here is to be able to encode data into the smallest sequence possible, as fast as possible, as we want this to be performant and capable of large amounts of data transmission with minimal impact on the user's data bill.
    - Also, because it's fun.
  The data itself will be a sequence of bits, but nodejs is all about buffers, so we'll need to create a translation layer between bits and bytes.
  We need utilities to create a final buffer object that we can use in networking libraries, as well as read the data back out.
  At the base level, we need to tools to to write a number of bits to a buffer, and read a number of bits from a buffer.

  --- ==== Writing ==== ---
  For the writing tool, we can mentally split the final data buffer into a series of single-byte buffers.
  We can also create a "live byte", which is the current byte that we're writing to. Once we've written 8 bits, we can create a buffer object, populate it with the live byte, and push it to the buffer chain.
  We can then reset the live byte, and continue writing to it.
  Depending on the amount of data we're trying to write, we may have to do this multiple times in a single write operation.

  When we're done, we can do this process once more to commit the final byte, push it to the buffer chain, and use Buffer.concat to create the final buffer.

  --- ==== Reading ==== ---
  For the reading tool, we can have an object with a single buffer, and a cursor.
*/

interface BinaryData {
  length: number;
}

class BinaryReader {
  private cursor = 0; // The bit position, not the byte position
  constructor(private buffer: Buffer) {}

  public read(length: number): Buffer {
    const end = this.cursor + length;
    const result = Buffer.alloc(Math.ceil(length * 4)); // Create a buffer big enough to hold the result

    // Copy the data into the result buffer (pretty sure this will require a loop)

    this.cursor = end;
    return result;
  }
}

/**
 * A class to sequentially write single bytes and output a buffer.
 * The internal buffer is a linked list of single-byte buffers.
 * */
class BinaryWriter {
  /**
   * Calculate the number of bits required to represent a number in little-endian format.
   * @param number The number to calculate the number of bits for.
   * @returns The number of bits required to represent the number.
   */
  static getBinarySize(number: number): number {
    return Math.ceil(Math.log2(Math.abs(number) + 1));
  }

  private bufferChain: LinkedList<Buffer>;
  
  private liveByte: number; // A single binary byte to use as a buffer. Data stored from left to right (i.e. the 8th bit is the first bit).
  private bitOffset: number; // The position, from left to right, of the current bit in the current byte. 0 means the byte is full, 8 means the byte is empty.

  constructor() {
    this.bufferChain = new LinkedList();
    this.liveByte = 0;
    this.bitOffset = 8;
  }
  /*
    copy livebyte
    shift livebyte to the right until its on position 0
    actually, create a bitmask to start with

    to create a bit mask:
    i = length of the capture
    mask = (1<<i) - 1, creates a block of 1s of that length
    then bitshift the mask to match the capture position
    then bitwise and the mask with the data
    then bitshift the result to the correct position in the livebyte, and or the result with the livebyte
  */

  /**
  * Write binary data to the buffer
  * @param data The data as a binary number.
  * @param length The number of bits to write (counting from the right).
  * @example write(0b1, 1) // Writes a single bit set to one to the buffer
  */
  writeRaw(data: number, length: number) {
    let cursor = length;
    while (cursor > 0) {
      if (this.bitOffset == 0) { // Byte is full, push to buffer chain
        const b = Buffer.allocUnsafe(1);
        b.writeUint8(this.liveByte);
        this.liveByte = 0b0;
        this.bitOffset = 8;
      }
      const size = Math.min(cursor, this.bitOffset);
      const offset = cursor - size;
      const mask = ((1 << size) - 1) << offset; // create a mask of 1s of the size of the capture, then shift it to the correct position
      const selection = (data & mask) >> offset; // get the selection of the data, then shift it back to the correct position
      this.liveByte |= selection; // overlay the new data on the live byte
      this.bitOffset -= size; // update the offset
      cursor -= size; // update the cursor
    }
  }

  writeBuffer(buffer: Buffer) {
    for (let i = 0; i < buffer.length; i++) {
      this.writeRaw(buffer.readUInt8(i), 8);
    }
  }

  /**
   * Get the buffer. The buffer is a concatenation of all single-byte buffers.
   * @returns The buffer.
   */
  finish(): Buffer {
    if (this.bitOffset < 8) { // If the live byte has data, push it to the buffer chain
      const b = Buffer.allocUnsafe(1);
      b.writeUint8(this.liveByte);
      this.liveByte = 0;
      this.bitOffset = 8;
    }

    const out = Buffer.concat(this.bufferChain.toArray());
    this.bufferChain.clear();
    return out;
  }
}

/**
 * A class to sequentially encode and write data and produce an unsized binary buffer
 * Data types are in the smallest possible form
 * Data types are encoded this way:
 *  - Booleans are encoded as 1 bit
 *  - Numbers are encoded with a 3 bit prefix counting the number of bytes required to represent the number (1-8)
 *  - Strings are encoded as a header with the length of the string (in the number encoding format), followed by the string itself
 */
class DataPacker {
  private buffer = new BinaryWriter();

  public writeBoolean(boolean: boolean): this {
    this.buffer.writeRaw(boolean ? 1 : 0, 1);
    return this;
  }

  public writeString(string: string): this {
    this.writeNumber(string.length);
    this.buffer.writeBuffer(Buffer.from(string, 'utf8'));
    return this;
  }

  
  public writeNumber(number: number): this {
    if (number%1<Number.EPSILON) { // Number is a float

    }
    const buffer = Buffer.alloc(4);
    if (number % 1 !== 0) { // not an integer
      buffer.writeFloatLE(number, 0);
    }
    this.buffers.push(buffer);
    return this;
  }

  public toBuffer(): Buffer {
    const buffer = Buffer.concat(this.buffers.toArray());
    return buffer;
  }
}
class DataReader {

}