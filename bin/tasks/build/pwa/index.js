"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.pwa = void 0;
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
var vinyl_1 = __importDefault(require("vinyl"));
var gulp_template_1 = __importDefault(require("gulp-template"));
var vinyl_fs_1 = require("vinyl-fs");
var gulp_tap_1 = __importDefault(require("gulp-tap"));
var icon = {
    title: 'Stage icon',
    task: function (context) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            context.pour((0, vinyl_fs_1.src)(context.config.presentation.icon), 'dest');
            return [2 /*return*/];
        });
    }); }
};
// write json object to vinyl file
function writeJson(obj, fileName) {
    var file = new vinyl_1["default"]({
        contents: Buffer.from(JSON.stringify(obj)),
        path: fileName
    });
    return file;
}
var generateWebManifest = {
    title: 'Generate Web Manifest',
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
        return context.pour(manifestStream, 'dest');
    }
};
var copyHTML = {
    title: 'Drop in HTML template',
    task: function (context, task) {
        var html = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1["default"].sep, "index.html"))
            .pipe((0, gulp_template_1["default"])({ title: context.config.name, favicon: './app_icon.png', touch_icon: './app_icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
        return context.pour(html, 'dest');
    }
};
var copyServiceWorker = {
    title: 'Generate File-Aware Service Worker',
    task: function (context, task) {
        return task.newListr([
            {
                title: 'Scan file tree',
                task: function (context) {
                    var files = context.serve('dest').pipe((0, gulp_tap_1["default"])(function (file) {
                        var _a;
                        var _b;
                        if (file.relative.includes('.'))
                            ((_a = (_b = context.data).fileMap) !== null && _a !== void 0 ? _a : (_b.fileMap = new Array())).push(file.relative);
                    }));
                    return context.pour(files, 'dest');
                }
            },
            {
                title: 'Drop in Service Worker template',
                task: function (context) {
                    var sw = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1["default"].sep, "service-worker.js"))
                        .pipe((0, gulp_template_1["default"])({ cache: JSON.stringify(context.data.fileMap), cache_name: "\"".concat(Date.now(), "\"") }, { interpolate: /'{{([\s\S]+?)}}'/gs }));
                    return context.pour(sw, 'dest');
                }
            }
        ]);
    },
    options: { bottomBar: Infinity }
};
exports.pwa = {
    tasks: [icon, generateWebManifest, copyHTML, copyServiceWorker]
};
