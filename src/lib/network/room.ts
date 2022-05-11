import { definePacket } from './protocol';


type ParticipantID = string;

type ParticipantState = {
  id: ParticipantID;
  name: string;
  connected: boolean;
}

type RoomState<T> = {
  participants: ParticipantState[];
  state: T;
}

export const ListRoomState = definePacket('updateRoomState', (state: RoomState) => {
  return { state };
});