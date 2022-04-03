"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFavicon = exports.ProcureAppIcon = exports.CopyAssets = void 0;
var merge2_1 = __importDefault(require("merge2"));
var sharp_1 = __importDefault(require("sharp"));
var stream_1 = require("stream");
var vinyl_fs_1 = require("vinyl-fs");
var gulp_rename_1 = __importDefault(require("gulp-rename"));
var vinyl_1 = __importDefault(require("vinyl"));
function CopyAssets(log, config) {
    return (0, merge2_1.default)((0, vinyl_fs_1.src)(config.resources), (0, vinyl_fs_1.src)(config.icon)).pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.CopyAssets = CopyAssets;
function ProcureAppIcon(log, config) {
    if (!config.appIcon) {
        log.info('No app icon specified, generating one from the general icon.');
        var stream_2 = new stream_1.PassThrough({ objectMode: true });
        (0, sharp_1.default)(config.icon)
            .resize(409, 409)
            .png()
            .flatten({ background: config.themeColor })
            .extend({ top: 103, left: 103, right: 103, bottom: 103, background: config.themeColor })
            .toBuffer().then(function (b) {
            stream_2.end(new vinyl_1.default({
                contents: b,
                path: 'app_icon.png'
            }));
        });
        return stream_2.pipe((0, vinyl_fs_1.dest)(config.out));
    }
    else {
        return (0, vinyl_fs_1.src)(config.appIcon).pipe((0, gulp_rename_1.default)('app_icon.png')).pipe((0, vinyl_fs_1.dest)(config.out));
    }
}
exports.ProcureAppIcon = ProcureAppIcon;
function GenerateFavicon(log, config) {
    var stream = new stream_1.PassThrough({ objectMode: true });
    (0, sharp_1.default)(config.icon)
        .resize(32, 32)
        .png()
        .toBuffer().then(function (b) {
        stream.end(new vinyl_1.default({
            contents: b,
            path: 'favicon.png'
        }));
    });
    return stream.pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.GenerateFavicon = GenerateFavicon;
