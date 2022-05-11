"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
const vinyl_fs_1 = require("vinyl-fs");
exports.resources = {
    title: 'Stage resources',
    task(context) {
        return context.artefacts.in.fill((0, vinyl_fs_1.src)(context.config.build.assets.resources));
    }
};
