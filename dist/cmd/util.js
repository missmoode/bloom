"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
var debug;
(function (debug) {
    function info(msg) {
        console.log("\uD83C\uDF37 ".concat(msg));
    }
    debug.info = info;
    function success(msg) {
        console.log("\uD83C\uDF38 ".concat(msg));
    }
    debug.success = success;
})(debug = exports.debug || (exports.debug = {}));
