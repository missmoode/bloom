import { Immutable } from '../../utils';
import { BufferReader, BufferWriter, NetworkCodec, StandardCodecs } from './encoding';


interface SchemaProperty<K extends string, C extends NetworkCodec<unknown>> {
  key: K;
  codec: C;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Schema = Array<SchemaProperty<string, NetworkCodec<any>>>;

type InstanceOfSchema<T extends Schema> = {
  [K in T[number]['key']]: Extract<T[number], {key: K}>['codec'] extends NetworkCodec<infer U> ? U : never;
};

function isCodec<E, T extends NetworkCodec<E>>(codec: T | unknown): codec is NetworkCodec<E> {
  return (codec as T).encode !== undefined && (codec as T).decode !== undefined;
}

function makeCodec<T extends Schema>(schema: T): NetworkCodec<InstanceOfSchema<T>> {
  return {
    encode(object: InstanceOfSchema<T>, buf: BufferWriter): void {
      for (const property of schema) { // read the object in the order of the schema
        buf.write(property.codec, (object as Pick<InstanceOfSchema<T>, string>)[property.key]);
      }
    },
    decode(data: BufferReader): InstanceOfSchema<T> {
      const result: Partial<InstanceOfSchema<T>> = {};
      for (const property of schema) {
        (result as Pick<InstanceOfSchema<T>, string>)[property.key] = data.read(property.codec);
      }
      return result as InstanceOfSchema<T>;
    }
  };
}

/**
 * Define a property of a packet.
 * @param key The key of the property for use in reading/writing
 * @param codec The codec to use to encode or decode this property
 */
export function property<K extends string, E, T extends NetworkCodec<E>>(key: K, codec: T): SchemaProperty<K, T>;
/**
 * Include another schema as a property of this one.
 * @param key The key of the property for use in reading/writing
 * @param payload Another schema to be read into or out of like a nested object
 */
export function property<K extends string, T extends Schema>(key: K, payload: T): SchemaProperty<K, NetworkCodec<InstanceOfSchema<T>>>;
export function property<K extends string, E>(key: K, codecOrSchema: Schema|NetworkCodec<E>): object {
  if (isCodec(codecOrSchema)) {
    return { key, codec: codecOrSchema };
  } else {
    return { key, codec: makeCodec(codecOrSchema) };
  }
}



type UnassociatedPacket<T extends Schema = Schema> = {
  readonly id: number;
  readonly codec: NetworkCodec<InstanceOfSchema<T>>;
}

/*
  Need a way to decode any packet
  packets are always preceded by a 2-byte domain and 2-byte id
  domain is used to determine the protocol the packet belongs to
    - this is so that we can have multiple functionalities which operate independently as drop-in modules
  id is used to determine the packet within the protocol
  maybe create some sort of header matching system?
*/

/**
 * 
 * @param packetID The ID of the packet as two-byte number, which will be used to identify it in the network. This must be unique for each packet within the protocol. Any bigger number will be truncated to a 16-bit number.
 * @param schema The schema of the packet, which defines the properties of the packet.
 * @returns A packet definition, which can be used to read and write packets as part of a communication protocol.
 */
export function definePacket<T extends Schema>(packetID: number, schema: T): UnassociatedPacket<T> {
  return {
    id: packetID,
    codec: makeCodec(schema)
  };
}

type ProtocolLayout = {
  [key: string]: UnassociatedPacket<Schema>;
}

type Protocol<T extends ProtocolLayout> = {
  getID(): number;
} & Immutable<T>;

export function defineProtocol<T extends ProtocolLayout>(id: number, protocol: T): Protocol<T> {
  return { ...protocol, getID: () => id };
}

const exampleProtocol = defineProtocol(0, {
  sendMessage: definePacket(0, [
    property('time', StandardCodecs.UBigInt),
    property('content', StandardCodecs.String),
  ])
});

class ProtcolManager {
  
  decode(data: Buffer): { identity: number };
}

/*
  Packet definition has an identifier and a codec. Could possibly call it a "message domain", and then have protocol also be one.

  "messagehandlers" are registrations of a header number and a function which can decode the message.

  Protocol is a collection of packet definitions as well as handlers.

  each encoder has a domain key
  domain key is encoded before the message
  part of an object which has:
    - a domain key
    - a codec
    - a place to send decoded messages

  so maybe protocol.packetName.construct(packet) returns a buffer?
 ¦
  Protocol should have the ability to create packet objects
  Separate receiving -- you create packet objects using the protocol when sending, and when receiving, the network manager will check a list of registered protocols

  protocol.createHandler(packet)? Somehow register a handler which informs the receiving code how to identify and decode the packet.
  Maybe *all* packets have an identity number, and the receiving code can use that to identify the packet.fg
*/

/*
const protocol = defineProtocol(0, {
  TEST_PACKET: definePacket(1, [
    property('id', StandardCodecs.UByte),
    property('blah', StandardCodecs.String),
  ]);
});

const TEST2_PACKET = [
  property('payload', TEST_PACKET),
  property('test', StandardCodecs.String),
];

type x = InstanceOfSchema<typeof TEST2_PACKET>;
const z: x = {
  payload: {
    id: 1,
    blah: 'blah',
  },
  test: 'test'
};

makeCodec(TEST_PACKET).encode({ id: 1, blah: 'blah' }, new BufferConcatenator());

protocol.register(1, TEST_PACKET);
then register protocol with the network manager with an id. this registers each schema from the protocol alongside the protocol id and packet id in a map, generating a codec for it for later use.
network manager provides destination objects
destination.send(TEST_PACKET, { id: 1, blah: 'blah' });
destination instance passes along the destination details, as well as the schema and the object to the network manager. network manager then grabs the correct codec for the schema and encodes the protocol/packet id, and then the object into a buffer to send.
if the network manager can't find the codec for the schema, it throws an error. this ensures that the codecs are registered before sending, so that remote network managers running the same code are definitely set up to receive the packet.

could also include a validation phase of some sort before accepting a connection to a peer to ensure that the remote peer is using the same protocol. Maybe generate a checksum from all registered schemas, or from encoding predictable bogus data into every schema, and then compare the checksums.

protocol = [
  packet(id, schema),
]

could protocol just count as another packet wrapper?
{
  subprotocol(id, {
    
  }),
}

*/
interface NetworkDestination {
  send<T extends Schema>(schema: T, object: InstanceOfSchema<T>): void;
}