"use strict";
exports.__esModule = true;
exports.Context = void 0;
var stream_1 = require("stream");
var Context = /** @class */ (function () {
    function Context(config) {
        this.data = {};
        this.streams = {};
        this.config = config;
    }
    Context.prototype.pour = function (from, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            var _b;
            from.on('error', reject);
            from.on('end', resolve);
            from.pipe(new stream_1.PassThrough({ objectMode: true })).pipe(((_a = (_b = _this.streams)[key]) !== null && _a !== void 0 ? _a : (_b[key] = new stream_1.PassThrough({ objectMode: true }))), { end: false });
        });
    };
    Context.prototype.serve = function (key) {
        var value = this.streams[key];
        delete this.streams[key];
        return value.end();
    };
    return Context;
}());
exports.Context = Context;
