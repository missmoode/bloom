"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebManifest = void 0;
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
var vinyl_fs_1 = require("vinyl-fs");
var vinyl_1 = __importDefault(require("vinyl"));
// write json object to vinyl file
function writeJson(obj, fileName) {
    var file = new vinyl_1.default({
        contents: Buffer.from(JSON.stringify(obj)),
        path: fileName
    });
    return file;
}
function WebManifest(log, config) {
    var manifest = {
        name: config.name,
        short_name: config.name,
        description: config.description,
        background_color: config.themeColor,
        theme_color: config.themeColor,
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
            {
                src: path_1.default.basename(config.icon),
                sizes: 'any',
                type: 'image/svg'
            },
            {
                src: 'app_icon.png',
                sizes: '72x72 96x96 128x128 256x256 512x512',
                type: 'image/png',
                maskable: true
            }
        ]
    };
    var manifestStream = new stream_1.PassThrough({ objectMode: true });
    manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));
    return manifestStream.pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.WebManifest = WebManifest;
