import { IDestroyOptions } from "@pixi/display";
import { FixedViewport } from "../view";
import { InternalViewport } from "../view/viewport";
export interface GameSession extends FixedViewport {
    destroy(): void;
}
export declare class InternalGameSession extends InternalViewport implements GameSession {
    private app?;
    private resizeObserver;
    constructor(containerElement: HTMLElement);
    destroy(options?: boolean | IDestroyOptions): void;
}
