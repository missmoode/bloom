"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stageFiles = exports.Platforms = void 0;
var vinyl_fs_1 = require("vinyl-fs");
exports.Platforms = ['web', 'pwa'];
function stageFiles(context, vinylStream) {
    return new Promise(function (resolve, reject) {
        var _a;
        vinylStream.on('end', resolve);
        vinylStream.on('error', reject);
        vinylStream.pipe((_a = context.fileStage) !== null && _a !== void 0 ? _a : (context.fileStage = (0, vinyl_fs_1.dest)(context.config.build.out)), { end: false });
    });
}
exports.stageFiles = stageFiles;
