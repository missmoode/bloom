import { Packet } from './packet';
import { Protocol, DecodedType, PacketProtocol, CodecName } from './protocol';

type UnpackedPayload<T extends PacketProtocol, E extends Packet> = E['name'] extends T[string] ? DecodedType<T[E['name']]> : never;

export class NetworkManager<T extends PacketProtocol> {
  constructor(
    private readonly protocol: T,
  ) {}


  public constructPacket<C extends CodecName<T>>(name: C, data: DecodedType<T[C]>): Packet {
    return {
      name,
      data
    };
  }
}


const one = {
  test: Protocol.codec((data: string) => data, (data: string) => data),
};


const two = {
  test2: Protocol.codec((data: boolean) => data, (data: boolean) => data),
};

const d = Protocol.combine(one, two);

new NetworkManager(Protocol.combine(one, two)).constructPacket('test2', true);