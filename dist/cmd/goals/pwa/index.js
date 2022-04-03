"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PWA = void 0;
var vinyl_fs_1 = require("vinyl-fs");
var gulp_template_1 = __importDefault(require("gulp-template"));
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var tasks_1 = require("../../tasks");
var misc_1 = require("../misc");
var misc_2 = require("../misc");
var webmanifest_1 = require("./webmanifest");
function list(directory) {
    var files = (0, fs_1.readdirSync)(directory);
    var result = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var fullPath = path_1.default.join(directory, file);
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
            result.push("/".concat(path_1.default.relative(base, file), "/").replace('//', '/'));
        }
        else {
            result.push("/".concat(path_1.default.relative(base, file)));
        }
    }
    result.push('/');
    return result;
}
function HTML(log, config) {
    var html = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1.default.sep, "index.html"))
        .pipe((0, gulp_template_1.default)({ title: config.name, favicon: './favicon.png', touch_icon: './touch-icon.png', theme_color: config.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
    return html.pipe((0, vinyl_fs_1.dest)(config.out));
}
function ServiceWorker(log, config) {
    return (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1.default.sep, "service-worker.js"))
        .pipe((0, gulp_template_1.default)({ cache: JSON.stringify(mapFilesRecursive(config.out)) }, { interpolate: /\/\*{{(.+?)}}\*\//gs }))
        .pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.PWA = (0, tasks_1.task)((0, tasks_1.sequence)(misc_1.Bundle, misc_2.CopyAssets, misc_1.ProcureAppIcon, misc_1.GenerateFavicon, webmanifest_1.WebManifest, HTML, ServiceWorker));
