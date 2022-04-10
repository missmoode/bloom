"use strict";
exports.__esModule = true;
exports.resources = void 0;
var vinyl_fs_1 = require("vinyl-fs");
exports.resources = {
    title: 'Stage resources',
    task: function (context) {
        return context.pour((0, vinyl_fs_1.src)(context.config.build.assets.resources), 'dest');
    }
};
