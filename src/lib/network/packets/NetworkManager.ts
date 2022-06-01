import { Buffer } from 'buffer';
import { BufferReader, PrimitiveCodecs, NetworkProtocol } from '../protocol';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

type PacketHandler<T> = (packet: T) => void;

export class NetworkManager {
  private protocols: { [id: number]: NetworkProtocol } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<Constructor<any>, PacketHandler<any>[]> = new Map();

  constructor(...protocols: NetworkProtocol[]) {
    this.protocols = protocols;
  }

  private decodePacket(data: Buffer): object {
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