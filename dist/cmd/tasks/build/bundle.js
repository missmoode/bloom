"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = void 0;
var stream_1 = __importDefault(require("@rollup/stream"));
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
var vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
var vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
var path_1 = __importDefault(require("path"));
var gulp_terser_1 = __importDefault(require("gulp-terser"));
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var gulp_sourcemaps_1 = __importDefault(require("gulp-sourcemaps"));
var context_1 = require("../context");
exports.bundle = {
    title: 'Bundle',
    task: function (context, task) {
        var babelConf = {
            extensions: ['.ts', '.js', '.json'],
            presets: ['@babel/preset-typescript', '@babel/preset-env'].map(require),
            babelHelpers: 'bundled',
            sourcemaps: context.config.build.bundle.sourcemaps ? context.config.build.bundle.main : undefined
        };
        var bundle = (0, stream_1.default)({
            input: context.config.build.bundle.main,
            plugins: [
                (0, plugin_node_resolve_1.default)({ preferBuiltins: false, extensions: ['.ts', '.js'] }),
                (0, plugin_commonjs_1.default)(),
                (0, plugin_babel_1.default)(babelConf),
                {
                    name: 'listr-output',
                    transform: function (code, id) {
                        task.output = "Bundling ".concat(id, "...");
                        return code;
                    }
                }
            ],
            output: {
                sourcemap: context.config.build.bundle.sourcemaps === true,
                format: 'umd'
            }
        }).pipe((0, vinyl_source_stream_1.default)('bundle.js'))
            .pipe((0, vinyl_buffer_1.default)());
        if (context.config.build.bundle.sourcemaps === true)
            bundle = bundle.pipe(gulp_sourcemaps_1.default.init({ loadMaps: true }));
        if (context.config.build.bundle.minify === true)
            bundle = bundle.pipe((0, gulp_terser_1.default)({ output: { comments: false }, compress: true, mangle: true }));
        if (context.config.build.bundle.sourcemaps === true)
            bundle = bundle.pipe(gulp_sourcemaps_1.default.write('.', { sourceRoot: path_1.default.relative(context.config.build.out, path_1.default.dirname(context.config.build.bundle.main)) }));
        return (0, context_1.stageFiles)(context, bundle);
    }
};
