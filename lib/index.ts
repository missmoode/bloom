import { GameSession, InternalGameSession } from './game';

export * from './view';
export * from './utils';

export const Game = new InternalGameSession(document.getElementsByTagName('main')[0]) as GameSession; 