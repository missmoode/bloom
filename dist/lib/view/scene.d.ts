import { View, ViewConstructor } from "./view";
declare type Resource = String;
/**
 * Details that the game needs to know to load the scene.
 */
export declare type Manifest = {
    /**
     * The resources that this scene requires.
     */
    resources: Resource[];
};
/**
 * A scene is a view connected to a scene manifest.
 * The scene manifest is used by the scene manager for critical pre-construction tasks, such as loading the resources.
 */
export declare type Scene<S extends View> = {
    /**
     * Scene constructor.
     */
    View: ViewConstructor<S>;
    /**
     * Details that the game needs to know to load the scene.
     */
    manifest: Manifest;
};
export declare namespace Scenes {
    function createScene<S extends View>(View: ViewConstructor<S>, manifest: Manifest): Scene<S>;
}
export {};
