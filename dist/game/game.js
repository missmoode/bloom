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
exports.Game = exports.InternalGameSession = void 0;
var app_1 = require("@pixi/app");
var host_1 = require("../scene/host");
var InternalGameSession = /** @class */ (function (_super) {
    __extends(InternalGameSession, _super);
    function InternalGameSession(containerElement) {
        var _this = _super.call(this, containerElement.clientWidth, containerElement.clientHeight) || this;
        _this.resizeObserver = new ResizeObserver(function (e) {
            _this.resize(e[0].contentRect.width, e[0].contentRect.height);
        });
        _this.app = new app_1.Application({
            resolution: window.devicePixelRatio || 1,
            resizeTo: containerElement,
            autoDensity: true
        });
        _this.app.stage = _this;
        _this.resizeObserver = new ResizeObserver(function (e) {
            _this.resize(e[0].contentRect.width, e[0].contentRect.height);
        });
        _this.resizeObserver.observe(containerElement);
        return _this;
    }
    InternalGameSession.prototype.destroy = function () {
        this.app.destroy();
        this.resizeObserver.disconnect();
    };
    return InternalGameSession;
}(host_1.InternalSceneHost));
exports.InternalGameSession = InternalGameSession;
exports.Game = new InternalGameSession(document.getElementsByTagName('main')[0]);
