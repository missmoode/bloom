import { Scene } from "./scene";
import { Container, DisplayObject } from "@pixi/display";
export interface FixedSceneHost {
    get width(): number;
    get height(): number;
    goto<S extends Scene>(link: SceneHost.Link<S>): void;
    finish(): void;
}
export interface SceneHost extends DisplayObject, FixedSceneHost {
    set width(width: number);
    set height(height: number);
    resize(width: number, height?: number): void;
}
export declare namespace SceneHost {
    type Link<S extends Scene = Scene> = {
        Target: Scene.Target<S>;
        Options: Scene.Parameters<S>;
    };
}
export declare function createSceneHost(width?: number, height?: number): SceneHost;
export declare function createSceneLink<S extends Scene>(Target: Scene.Target<S>, ...Options: Scene.Parameters<S>): SceneHost.Link;
export declare class InternalSceneHost extends Container implements SceneHost {
    private scene?;
    private __width;
    private __height;
    constructor(width: number, height: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    resize(width: number, height?: number): void;
    goto<S extends Scene>(link: SceneHost.Link<S>): void;
    /**
     * Informs the game that the scene is no longer running.
     * This tells the game that:
     *  - Any assets that only it was using can be safely unloaded.
     *  - It no longer needs to listen for events or receive update signals.
     */
    finish(): void;
}
