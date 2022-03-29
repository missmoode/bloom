import { FixedSceneHost } from "../scene";
import { InternalSceneHost } from "../scene/host";
export interface GameSession extends FixedSceneHost {
    destroy(): void;
}
export declare class InternalGameSession extends InternalSceneHost {
    private app;
    private resizeObserver;
    constructor(containerElement: HTMLElement);
    destroy(): void;
}
export declare const Game: GameSession;
