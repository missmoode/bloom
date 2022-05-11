import Peer from 'peerjs';
import { v4 as uuid } from 'uuid';
/*
  PeerJS only does peer-to-peer connections. Will have to leverage that to create a mesh network.
*/
class NetworkSession {
  private name: ParticipantID;

  constructor() {
    this.name = uuid();
    new Peer(this.name);
  }

  public joinRoomByParticipant(name: ParticipantID) {
  }
}