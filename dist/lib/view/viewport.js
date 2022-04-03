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
exports.Viewport = exports.InternalViewport = void 0;
var display_1 = require("@pixi/display");
var stage_1 = require("./stage");
var InternalViewport = /** @class */ (function (_super) {
    __extends(InternalViewport, _super);
    function InternalViewport(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = width; }
        var _this = _super.call(this) || this;
        _this.__width = width;
        _this.__height = height;
        return _this;
    }
    Object.defineProperty(InternalViewport.prototype, "width", {
        get: function () {
            return this.__width;
        },
        set: function (width) {
            this.resize(width, this.__height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InternalViewport.prototype, "height", {
        get: function () {
            return this.__height;
        },
        set: function (height) {
            this.resize(this.__width, height);
        },
        enumerable: false,
        configurable: true
    });
    InternalViewport.prototype.resize = function (width, height) {
        if (height === void 0) { height = width; }
        this.__width = width;
        this.__height = height;
        if (this.view) {
            this.view.onSizeChanged();
        }
    };
    InternalViewport.prototype.goto = function (View, opts) {
        this.finish();
        this.view = new View(new stage_1.StageInternal(this), opts);
        this.addChild(this.view.stage);
    };
    /**
     * Informs the game that the View is no longer running.
     * This tells the game that:
     *  - Any assets that only it was using can be safely unloaded.
     *  - It no longer needs to listen for events or receive update signals.
     */
    InternalViewport.prototype.finish = function () {
        var _a, _b;
        if (this.view) {
            this.removeChild((_a = this.view) === null || _a === void 0 ? void 0 : _a.stage);
            ((_b = this.view) === null || _b === void 0 ? void 0 : _b.stage).destroy(true);
        }
    };
    return InternalViewport;
}(display_1.Container));
exports.InternalViewport = InternalViewport;
exports.Viewport = InternalViewport;
