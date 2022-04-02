import { Container, DisplayObject } from "@pixi/display";
import { ArgumentViewConstructor, DefaultViewConstructor, ViewConstructor, View } from "./view";
export interface FixedViewport {
    get width(): number;
    get height(): number;
    goto<V extends View>(View: DefaultViewConstructor<V>): void;
    goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
    finish(): void;
}
export interface MutableViewport extends DisplayObject, FixedViewport {
    set width(width: number);
    set height(height: number);
    resize(width: number, height?: number): void;
}
export declare class InternalViewport extends Container implements MutableViewport {
    private view?;
    private __width;
    private __height;
    constructor(width?: number, height?: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    resize(width: number, height?: number): void;
    goto<V extends View>(View: DefaultViewConstructor<V>): void;
    goto<V extends View>(View: ArgumentViewConstructor<V>, opts: ConstructorParameters<ViewConstructor<V>>[1]): void;
    /**
     * Informs the game that the View is no longer running.
     * This tells the game that:
     *  - Any assets that only it was using can be safely unloaded.
     *  - It no longer needs to listen for events or receive update signals.
     */
    finish(): void;
}
export declare const Viewport: new (width?: number | undefined, height?: number | undefined) => MutableViewport;
