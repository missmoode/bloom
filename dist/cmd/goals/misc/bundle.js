"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundle = void 0;
var stream_1 = __importDefault(require("@rollup/stream"));
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
var vinyl_fs_1 = require("vinyl-fs");
var vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
var vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
var path_1 = __importDefault(require("path"));
var gulp_terser_1 = __importDefault(require("gulp-terser"));
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var gulp_sourcemaps_1 = __importDefault(require("gulp-sourcemaps"));
function Bundle(log, config) {
    var babelConf = {
        extensions: ['.ts', '.js', '.json'],
        presets: ['@babel/preset-typescript', '@babel/preset-env'].map(require),
        babelHelpers: 'bundled',
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
    }).pipe((0, vinyl_source_stream_1.default)('bundle.js'))
        .pipe((0, vinyl_buffer_1.default)());
    if (!config.production)
        bundle = bundle.pipe(gulp_sourcemaps_1.default.init({ loadMaps: true }));
    bundle = bundle.pipe((0, gulp_terser_1.default)({ output: { comments: false }, compress: config.production, mangle: true }));
    if (!config.production)
        bundle = bundle.pipe(gulp_sourcemaps_1.default.write('.', { sourceRoot: path_1.default.relative(config.out, path_1.default.dirname(config.applicationRoot)) }));
    return bundle.pipe((0, vinyl_fs_1.dest)(config.out));
}
exports.Bundle = Bundle;
