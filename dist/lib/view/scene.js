"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenes = void 0;
var Scenes;
(function (Scenes) {
    function createScene(View, manifest) {
        return { View: View, manifest: manifest };
    }
    Scenes.createScene = createScene;
    // export function loadScene<S extends View>(scene: Scene<S>): Scene<S> {
    //   for (const resource of scene.manifest.resources) {
    //   }
    // }
})(Scenes = exports.Scenes || (exports.Scenes = {}));
