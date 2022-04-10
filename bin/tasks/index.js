"use strict";
exports.__esModule = true;
exports.run = void 0;
var listr2_1 = require("listr2");
var build_1 = require("./build");
var context_1 = require("./context");
function run(config, platform) {
    return new listr2_1.Listr((0, build_1.build)(platform), { rendererOptions: { showTimer: true } }).run(new context_1.Context(config));
}
exports.run = run;
