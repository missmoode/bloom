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
exports.StageInternal = void 0;
var display_1 = require("@pixi/display");
var math_1 = require("@pixi/math");
var StageInternal = /** @class */ (function (_super) {
    __extends(StageInternal, _super);
    function StageInternal(host) {
        var _this = _super.call(this) || this;
        _this.host = host;
        return _this;
    }
    Object.defineProperty(StageInternal.prototype, "width", {
        get: function () {
            return this.host.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StageInternal.prototype, "height", {
        get: function () {
            return this.host.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StageInternal.prototype, "mid", {
        get: function () {
            return new math_1.Point(this.width / 2, this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    return StageInternal;
}(display_1.Container));
exports.StageInternal = StageInternal;
