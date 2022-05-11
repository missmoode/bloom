export type ProtocolVersion = number;
export type PacketDescriptor = string;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PacketProducer<P extends TransmissionPayload> = (...args: any[]) => P;

export type TransmissionPayload =
  | string
  | number
  | boolean
  | null
  | TransmissionPayload[]
  | { [key: string]: TransmissionPayload };

interface Packet<D extends PacketDescriptor = PacketDescriptor, P extends TransmissionPayload = TransmissionPayload> {
  type: D;
  payload: P;
}
interface ProtocolPacket<D extends PacketDescriptor, P extends TransmissionPayload, F extends PacketProducer<P>> {
  make(...args: Parameters<F>): Packet<D, P>;
  match(packet: Packet): packet is Packet<D, P>;
}
/**
 * 
 * @param type The name of the packet, used in the network to identify the packet
 * @param factory A function that takes the arguments of the packet and returns the payload
 * @returns An object that can be used to create a packet and match against a packet
 */
export function definePacket<P extends TransmissionPayload>(type: PacketDescriptor, factory: PacketProducer<P>):
 ProtocolPacket<typeof type, P, typeof factory> {
  return {
    make(...args: Parameters<typeof factory>) {
      return {
        type: type,
        payload: factory(...args)
      };
    },
    match(packet: Packet): packet is Packet<typeof type, P> {
      return packet.type === type;
    }
  };
}