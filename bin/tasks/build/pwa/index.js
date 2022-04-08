"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.copyServiceWorker = exports.copyHTML = exports.generateWebManifest = void 0;
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
var vinyl_1 = __importDefault(require("vinyl"));
var context_1 = require("../../context");
var gulp_template_1 = __importDefault(require("gulp-template"));
var vinyl_fs_1 = require("vinyl-fs");
var fs_1 = require("fs");
// write json object to vinyl file
function writeJson(obj, fileName) {
    var file = new vinyl_1["default"]({
        contents: Buffer.from(JSON.stringify(obj)),
        path: fileName
    });
    return file;
}
exports.generateWebManifest = {
    title: 'Generate Web Manifest (PWA)',
    task: function (context, task) {
        var manifest = {
            name: context.config.name,
            background_color: context.config.presentation.themeColor,
            theme_color: context.config.presentation.themeColor,
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/',
            icons: [
                {
                    src: path_1["default"].basename(context.config.presentation.icon),
                    sizes: 'any',
                    type: 'image/svg'
                },
                {
                    src: 'app_icon.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ]
        };
        var manifestStream = new stream_1.PassThrough({ objectMode: true });
        manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));
        return (0, context_1.stageFiles)(context, manifestStream);
    },
    enabled: function (context) { return context.platform === 'pwa'; }
};
function list(directory) {
    var files = (0, fs_1.readdirSync)(directory);
    var result = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var fullPath = path_1["default"].join(directory, file);
        if ((0, fs_1.statSync)(fullPath).isDirectory()) {
            result.push.apply(result, list(fullPath));
        }
        else {
            result.push(fullPath);
        }
    }
    return result;
}
// from a list of files and directories
// add a trailing slash for each directory
// and return a list of files
function mapFilesRecursive(base) {
    var files = list(base);
    var result = [];
    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
        var file = files_2[_i];
        if ((0, fs_1.statSync)(file).isDirectory()) {
            result.push("/".concat(path_1["default"].relative(base, file), "/").replace('//', '/'));
        }
        else {
            result.push("/".concat(path_1["default"].relative(base, file)));
        }
    }
    result.push('/');
    return result;
}
exports.copyHTML = {
    title: 'Drop in HTML template (PWA)',
    task: function (context, task) {
        var html = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1["default"].sep, "service-worker.js"))
            .pipe((0, gulp_template_1["default"])({ title: context.config.name, favicon: './favicon.png', touch_icon: './touch-icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
        return (0, context_1.stageFiles)(context, html);
    },
    enabled: function (context) { return context.platform === 'pwa'; }
};
exports.copyServiceWorker = {
    title: 'Drop in Service Worker template (PWA)',
    task: function (context, task) {
        var sw = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1["default"].sep, "service-worker.js"))
            .pipe((0, gulp_template_1["default"])({ cache: JSON.stringify(mapFilesRecursive(context.config.build.out)), cache_name: "\"".concat(Date.now(), "\"") }, { interpolate: /'{{([\s\S]+?)}}'/gs }));
        return (0, context_1.stageFiles)(context, sw);
    },
    enabled: function (context) { return context.platform === 'pwa'; }
};
