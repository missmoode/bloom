import { Container } from "@pixi/display";
import { Point } from "@pixi/math";
import { FixedViewport } from "./viewport";
declare type Passed = 'addChild' | 'addChildAt' | 'removeChild' | 'removeChildAt' | 'removeChildren' | 'swapChildren' | 'getChildIndex' | 'setChildIndex' | 'sortChildren' | 'sortDirty' | 'sortableChildren' | 'children' | 'render' | 'calculateBounds';
export interface Stage extends Pick<Container, Passed> {
    get width(): number;
    get height(): number;
    get mid(): Point;
}
export declare class StageInternal extends Container implements Stage {
    private host;
    constructor(host: FixedViewport);
    get width(): number;
    get height(): number;
    get mid(): Point;
}
export {};
