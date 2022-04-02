"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceWorker = exports.Web = void 0;
var stream_1 = __importDefault(require("@rollup/stream"));
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
var vinyl_fs_1 = require("vinyl-fs");
var vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
var vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
var merge2_1 = __importDefault(require("merge2"));
var gulp_template_1 = __importDefault(require("gulp-template"));
var sharp_1 = __importDefault(require("sharp"));
var path_1 = __importDefault(require("path"));
var stream_2 = require("stream");
var vinyl_1 = __importDefault(require("vinyl"));
var gulp_terser_1 = __importDefault(require("gulp-terser"));
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var gulp_sourcemaps_1 = __importDefault(require("gulp-sourcemaps"));
var fs_1 = require("fs");
function list(directory) {
    var files = (0, fs_1.readdirSync)(directory);
    var result = [];
    result.push(directory);
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
    return result;
}
function Web(config) {
    var _a;
    var babelConf = {
        extensions: ['.ts', '.js', '.json'],
        presets: ['@babel/preset-typescript', '@babel/preset-env'],
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        sourcemaps: config.applicationRoot
    };
    var bundle = (0, stream_1.default)({
        input: config.applicationRoot,
        plugins: [(0, plugin_node_resolve_1.default)({ preferBuiltins: false, extensions: ['.ts', '.js', '.json'] }), (0, plugin_commonjs_1.default)(), (0, plugin_babel_1.default)(babelConf)],
        output: {
            dir: config.out,
            sourcemap: !config.production,
            format: 'umd'
        }
    }).pipe((0, vinyl_source_stream_1.default)("bundle.js"))
        .pipe((0, vinyl_buffer_1.default)());
    if (!config.production)
        bundle = bundle.pipe(gulp_sourcemaps_1.default.init({ loadMaps: true }));
    bundle = bundle.pipe((0, gulp_terser_1.default)({ output: { comments: false } }));
    if (!config.production)
        bundle = bundle.pipe(gulp_sourcemaps_1.default.write('.', { sourceRoot: path_1.default.relative(config.out, path_1.default.dirname(config.applicationRoot)) }));
    var copyResources = (0, vinyl_fs_1.src)(config.resources);
    var html = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1.default.sep, "index.html"))
        .pipe((0, gulp_template_1.default)({ title: config.name, icon: "".concat(path_1.default.basename(config.icon).replace('svg', 'png')), theme_color: config.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
    var icon = (0, vinyl_fs_1.src)(config.icon);
    var iconPNG = rasterize(config.icon, 512);
    var icons = [
        {
            src: path_1.default.basename(config.icon),
            sizes: 'any',
            type: 'image/svg'
        },
        {
            src: "".concat(path_1.default.basename(config.icon).replace('svg', 'png')),
            sizes: '72x72 96x96 128x128 256x256 512x512',
            type: 'image/png'
        }
    ];
    var manifest = (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1.default.sep, "manifest.webmanifest"))
        .pipe((0, gulp_template_1.default)({ title: (_a = config.shortname) !== null && _a !== void 0 ? _a : config.name, theme_color: config.themeColor, icons: JSON.stringify(icons) }, { interpolate: /{{(.+?)}}/gs }));
    return (0, merge2_1.default)(bundle, copyResources, html, icon, iconPNG, manifest).pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.Web = Web;
function ServiceWorker(config) {
    return (0, vinyl_fs_1.src)("".concat(__dirname).concat(path_1.default.sep, "service-worker.js"))
        .pipe((0, gulp_template_1.default)({ cache: JSON.stringify(mapFilesRecursive(config.out)) }, { interpolate: /{{(.+?)}}/gs }))
        .pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.ServiceWorker = ServiceWorker;
function rasterize(input, width, height) {
    if (height === void 0) { height = width; }
    var stream = new stream_2.PassThrough({ objectMode: true });
    (0, sharp_1.default)(input)
        .resize(width, height)
        .png()
        .toBuffer().then(function (b) {
        stream.end(new vinyl_1.default({
            contents: b,
            path: path_1.default.basename(input).replace('svg', 'png')
        }));
    }).catch(function (e) { return stream.emit('error', e); });
    return stream;
}
