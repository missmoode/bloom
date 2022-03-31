"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenes = void 0;
var view_1 = require("./view");
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
var HomeScene = /** @class */ (function (_super) {
    __extends(HomeScene, _super);
    function HomeScene(stage, opts) {
        return _super.call(this, stage) || this;
        /** */
    }
    return HomeScene;
}(view_1.View));
var TestScene = /** @class */ (function (_super) {
    __extends(TestScene, _super);
    function TestScene(stage) {
        return _super.call(this, stage) || this;
        /** */
    }
    return TestScene;
}(view_1.View));
