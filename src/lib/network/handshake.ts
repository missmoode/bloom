import { definePacket, ProtocolVersion } from './protocol';

export const Handshake = definePacket('handshake', (version: ProtocolVersion) => {return { version };});