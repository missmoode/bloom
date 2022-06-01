import { Buffer } from 'buffer';
import { BufferReader, Codec, PrimitiveCodecs } from '../protocol';

class NetworkProtocol {
  private codecs: { [id: number]: Codec<any> } = {};

  /**
   * Register a packet codec with the network protocol.
   * @param id A 2-byte unsigned integer used to identify the packet. Must be unique.
   * @param codec The codec used to encode and decode the packet.
   * @returns This for chaining.
   */
  registerPacket<T>(id: number, codec: Codec<T>): this {
    this.codecs[id] = codec;
    return this;
  }
  decodePacket(data: BufferReader): Codec<any> {
    const id = data.readRaw(1).readUInt8();
    const codec = this.codecs[id];
    if (!codec) {
      throw new Error(`Packet ${id} not found`);
    } else {
      return codec.decode(data);
    }
  }
}

type Constructor<T> = new (...args: any[]) => T;

type PacketHandler<T> = (packet: T) => void;

class NetworkManager {
  private protocols: { [id: number]: NetworkProtocol } = {};
  private listeners: Map<Constructor<any>, PacketHandler<any>[]> = new Map();

  constructor(...protocols: NetworkProtocol[]) {
    this.protocols = protocols;
  }

  private decodePacket(data: Buffer) {
    const buf = new BufferReader(data);
    const id = buf.read(PrimitiveCodecs.UByte);
    const proto = this.protocols[id];
    if (!proto) {
      throw new Error(`Protocol ${id} not found`);
    } else {
      return proto.decodePacket(buf);
    }
  }

  private handlePacketData(data: Buffer) {
    const packet = this.decodePacket(data);
    const constructor = Object.getPrototypeOf(packet).constructor;
    if (this.listeners.has(constructor)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners.get(constructor)!.forEach(handler => handler(packet));
    } else {
      console.warn('No listeners for packet', packet);
    }
  }

  public on<Packet>(packetType: Constructor<Packet>, handler: PacketHandler<Packet>) {
    if (!this.listeners.has(packetType)) {
      this.listeners.set(packetType, []);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listeners.get(packetType)!.push(handler);
  }
}