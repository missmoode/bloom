import { FixedSceneHost, Scene } from "../scene";
import { InternalSceneHost } from "../scene/host";
import { Constructor } from "../util";
export interface GameSession extends FixedSceneHost {
    destroy(): void;
    prepareScene<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest): Scene.Target<S>;
}
export declare class InternalGameSession extends InternalSceneHost implements GameSession {
    private app?;
    private resizeObserver;
    constructor(containerElement: HTMLElement);
    destroy(): void;
    prepareScene<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest): Scene.Target<S>;
}
export declare const Game: GameSession;
