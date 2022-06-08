import { BufferReader, Codec } from './encoding/data';

export type PacketID<T extends object = object> = number;

/*
  How this should work:
   - The user runs a function and passes in a packet object to be encoded.
   - They should be able to pass in additional metadata -- who the packet should be sent to, if it's part of a conversation, etc.
   - I'm thinking that we should have specific types of packet object that are meant to be sent specifically to a person. Could wrap more general packets in one of those if needs be.
   - The networking system will work similarly to streams, though bidirectional.
*/

/**
 * Handles an incoming packet and passes it forward in some way.
 */
interface IncomingTransmissionHandler<T> {
  handleIncoming<P extends T>(transmission: P): void;
}

/**
 * Handles an outgoing packet and passes it forward in some way.
 */
interface OutgoingTransmissionHandler<T> {
  handleOutgoing<P extends T>(packet: P): void;
}

class NetworkProtocolMultiplexer implements IncomingTransmissionHandler<BufferReader> {
  constructor(outgoing)
}

export class NetworkProtocol {
  /**
   * 
   * @param protocolID A single-byte id used to identify the protocol. This id must be unique within the network manager.
   */
  constructor (public readonly protocolID: number) {}

  private codecs: { [id: number]: Codec<object>; } = {};
  private locked = false;

  /**
   * Register a packet codec with the network protocol.
   * @param id A single-byte id used to identify the packet. This id must be unique within the protocol.
   * @param codec The codec used to encode and decode the packet.
   * @returns A packet ID for reference.
   */
  registerPacket<T extends object>(id: number, codec: Codec<T>): PacketID<T> {
    if (this.locked) throw new Error('Cannot register packet after protocol is locked');
    this.codecs[id] = codec;
    return this.protocolID << 8 && id;
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
  getCodec<T extends object>(id: PacketID<T>): Codec<T> {
    return this.codecs[id & 0xff] as Codec<T>;
  }

  lock() {
    this.locked = true;
  }
}


const defaults = new NetworkProtocol(0);
defaults.registerPacket(0, new Codec<object>());