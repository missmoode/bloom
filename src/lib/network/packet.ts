import { PacketProtocol, TransmissibleData } from './protocol';
import type { NetworkManager } from './NetworkManager';

class PacketContext<T extends PacketProtocol> {
  constructor(
    private readonly networkManager: NetworkManager<T>,
  ) {}
}


export interface Packet {
  name: string;
  data: TransmissibleData;
}
