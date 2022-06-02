import { BufferReader, Codec } from './data';

export class NetworkProtocol {
  private codecs: { [id: number]: Codec<object>; } = {};

  /**
   * Register a packet codec with the network protocol.
   * @param id A single-byte id used to identify the packet. This id must be unique within the protocol.
   * @param codec The codec used to encode and decode the packet.
   * @returns This for chaining.
   */
  registerPacket<T extends object>(id: number, codec: Codec<T>): this {
    this.codecs[id] = codec;
    return this;
  }
  decodePacket(data: BufferReader): object {
    const id = data.readRaw(1).readUInt8();
    const codec = this.codecs[id];
    if (!codec) {
      throw new Error(`Packet ${id} not found`);
    } else {
      return codec.decode(data);
    }
  }
}
