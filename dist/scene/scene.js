"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSceneTarget = exports.Scene = void 0;
var Scene = /** @class */ (function () {
    function Scene(stage) {
        this.stage = stage;
    }
    Scene.prototype.onSizeChanged = function () {
    };
    return Scene;
}());
exports.Scene = Scene;
function createSceneTarget(Scene, manifest) {
    return { Scene: Scene, Manifest: manifest };
}
exports.createSceneTarget = createSceneTarget;
