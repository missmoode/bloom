
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type TransmissiblePrimitives =
| string
| number
| boolean
| undefined;
type TransmissibleArray =
| string[]
| number[]
| boolean[]
| TransmissibleObject[];

type TransmissibleObject = { [key: string]: TransmissibleData };
export type TransmissibleData = TransmissiblePrimitives | TransmissibleArray | TransmissibleObject;

export interface Codec<Incoming extends TransmissibleData, Outgoing> {
  decoder: (data: Incoming) => Outgoing;
  encoder: (data: Outgoing) => Incoming;
}

export type EncodedType<T extends Codec<Any, Any>> = T extends Codec<infer Encoded, Any> ? Encoded : never;
export type DecodedType<T extends Codec<Any, Any>> = T extends Codec<Any, infer Decoded> ? Decoded : never;

function codec<Encoded extends TransmissibleData, Decoded>(encoder: (outgoing: Decoded) => Encoded, decoder: (incoming: Encoded) => Decoded): Codec<Encoded, Decoded> {
  return {
    encoder,
    decoder
  };
}

export type Combined<T extends Any[]> =
T extends [infer A, infer B, ...infer C]
? C extends []
  ? A & B
  : A & B & Combined<C>
: Record<string, never>;

export type PacketProtocol = Record<string, Codec<Any, Any>>;
export type CodecName<T extends PacketProtocol> = Extract<keyof T, string>;

function combine<P extends PacketProtocol[]>(...protocols: P): Combined<P> {
  const combinedProtocol = {} as PacketProtocol;
  for (const protocol of protocols) {
    for (const name in protocol) {
      if (combinedProtocol[name]) {
        throw new Error(`Packet names cannot be defined twice (on "${name}".)`);
      }
      combinedProtocol[name] = protocol[name];
    }
  }
  return combinedProtocol as Combined<P>;
}
export const Protocol = { codec, combine };