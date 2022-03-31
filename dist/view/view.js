"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var viewport_1 = require("./viewport");
var View = /** @class */ (function () {
    function View(stage) {
        this.stage = stage;
    }
    View.prototype.onSizeChanged = function () {
    };
    return View;
}());
exports.View = View;
new viewport_1.Viewport(3, 3);
