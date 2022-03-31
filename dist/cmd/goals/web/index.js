"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web = void 0;
var stream_1 = __importDefault(require("@rollup/stream"));
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var vinyl_fs_1 = require("vinyl-fs");
var vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
var vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
var merge2_1 = __importDefault(require("merge2"));
var gulp_template_1 = __importDefault(require("gulp-template"));
var sharp_1 = __importDefault(require("sharp"));
var path_1 = __importDefault(require("path"));
function Web(config) {
    var _a;
    var babelConf = {
        extensions: ['.ts', '.js'],
        presets: ['@babel/plugin-typescript'],
        exclude: 'node_modules/**'
    };
    var bundle = (0, stream_1.default)({
        input: config.rootScript,
        plugins: [(0, plugin_babel_1.default)(babelConf)],
        output: {
            dir: config.outDir
        }
    }).pipe((0, vinyl_source_stream_1.default)("bundle.js"))
        .pipe((0, vinyl_buffer_1.default)());
    var copyResources = (0, vinyl_fs_1.src)(config.resources);
    var html = (0, vinyl_source_stream_1.default)("".concat(__dirname, "/index.html"))
        .pipe((0, gulp_template_1.default)({ title: config.name, icon: "./".concat(path_1.default.basename(config.iconSVGPath).replace('svg', 'png')) }, { interpolate: /{{([\s\S]+?)}}/g }));
    var icon = (0, vinyl_fs_1.src)(config.iconSVGPath);
    var iconPNG = rasterize(config.iconSVGPath, 512);
    var icons = [
        {
            src: path_1.default.basename(config.iconSVGPath),
            sizes: 'any'
        },
        {
            src: "./".concat(path_1.default.basename(config.iconSVGPath).replace('svg', 'png')),
            sizes: 'any'
        }
    ];
    var manifest = (0, vinyl_source_stream_1.default)("".concat(__dirname, "/manifest.webmanifest"))
        .pipe((0, gulp_template_1.default)({ title: (_a = config.shortname) !== null && _a !== void 0 ? _a : config.name, theme_color: config.themeColor, icons: "icons: ".concat(JSON.stringify(icons)) }, { interpolate: /{{(.+?)}}/gs }));
    return (0, merge2_1.default)(bundle, copyResources, html, icon, iconPNG, manifest).pipe((0, vinyl_fs_1.dest)(config.outDir));
}
exports.Web = Web;
function rasterize(input, width, height) {
    if (height === void 0) { height = width; }
    return (0, sharp_1.default)(input)
        .resize(width, height)
        .png()
        .pipe((0, vinyl_buffer_1.default)());
}