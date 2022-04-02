import { Stage } from "./stage";
export declare abstract class View {
    readonly stage: Stage;
    constructor(stage: Stage);
    onSizeChanged(): void;
}
export declare type ViewConstructor<T extends View> = new (stage: Stage, opts: any | undefined) => T;
export declare type DefaultViewConstructor<T extends View> = new (stage: Stage, opts: undefined) => T;
export declare type ArgumentViewConstructor<T extends View> = new (stage: Stage, opts: any) => T;
