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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalSceneHost = exports.createSceneLink = exports.createSceneHost = void 0;
var display_1 = require("@pixi/display");
var stage_1 = require("./stage");
function createSceneHost(width, height) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = width; }
    return new InternalSceneHost(width, height);
}
exports.createSceneHost = createSceneHost;
function createSceneLink(Target) {
    var Options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        Options[_i - 1] = arguments[_i];
    }
    return { Target: Target, Options: Options };
}
exports.createSceneLink = createSceneLink;
var InternalSceneHost = /** @class */ (function (_super) {
    __extends(InternalSceneHost, _super);
    function InternalSceneHost(width, height) {
        var _this = _super.call(this) || this;
        _this.__width = width;
        _this.__height = height;
        return _this;
    }
    Object.defineProperty(InternalSceneHost.prototype, "width", {
        get: function () {
            return this.__width;
        },
        set: function (width) {
            this.__width = width;
            this.resize(width, this.__height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InternalSceneHost.prototype, "height", {
        get: function () {
            return this.height;
        },
        set: function (height) {
            this.__height = height;
            this.resize(this.__width, height);
        },
        enumerable: false,
        configurable: true
    });
    InternalSceneHost.prototype.resize = function (width, height) {
        if (height === void 0) { height = width; }
        if (this.scene) {
            this.scene.onSizeChanged();
        }
    };
    InternalSceneHost.prototype.load = function (link) {
        var _a;
        this.scene = new ((_a = link.Target.Scene).bind.apply(_a, __spreadArray([void 0, new stage_1.StageInternal(this)], link.Options, false)))();
    };
    /**
     * Informs the game that the scene is no longer running.
     * This tells the game that:
     *  - Any assets that only it was using can be safely unloaded.
     *  - It no longer needs to listen for events or receive update signals.
     */
    InternalSceneHost.prototype.finish = function () {
        var _a, _b;
        this.removeChild((_a = this.scene) === null || _a === void 0 ? void 0 : _a.stage);
        ((_b = this.scene) === null || _b === void 0 ? void 0 : _b.stage).destroy();
    };
    return InternalSceneHost;
}(display_1.Container));
exports.InternalSceneHost = InternalSceneHost;
