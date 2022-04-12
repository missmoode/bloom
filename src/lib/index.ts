import { LocalGameSession, InternalGameSession } from './game';

export * from './view';
export * from './utils';
export * from './resources';

export const Game = new InternalGameSession(document.getElementsByTagName('main')[0]) as LocalGameSession; 