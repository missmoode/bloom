import { Constructor } from "../util";
import { Stage } from "./stage";
export declare abstract class Scene {
    readonly stage: Stage;
    constructor(stage: Stage);
    onSizeChanged(): void;
}
declare type Path = String;
export declare namespace Scene {
    export type Target<S extends Scene> = {
        Scene: Constructor<S>;
        manifest: Manifest;
    };
    type ShiftedConstructorParameters<C extends new (...args: any) => any> = ConstructorParameters<C> extends [infer _First, ...infer Rest] ? Rest : ConstructorParameters<C>;
    export type Parameters<S extends Scene> = ShiftedConstructorParameters<Constructor<S>>;
    export type Manifest = {
        resources: Path[];
    };
    export {};
}
export declare function createSceneTarget<S extends Scene>(Scene: Constructor<S>, manifest: Scene.Manifest): {
    Scene: Constructor<S, any>;
    Manifest: Scene.Manifest;
};
export {};
