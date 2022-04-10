"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.bundle = void 0;
var stream_1 = __importDefault(require("@rollup/stream"));
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
var vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
var vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
var path_1 = __importDefault(require("path"));
var gulp_terser_1 = __importDefault(require("gulp-terser"));
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
var gulp_sourcemaps_1 = __importDefault(require("gulp-sourcemaps"));
exports.bundle = {
    title: 'Create bundle',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: function (context, task) {
        return task.newListr([
            {
                title: 'Condense source',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                task: function (context, btask) {
                    var babelConf = {
                        extensions: ['.ts', '.js'],
                        presets: ['@babel/preset-typescript', '@babel/preset-env'],
                        babelrc: false,
                        babelHelpers: 'bundled'
                    };
                    var count = 0;
                    var bundle = (0, stream_1["default"])({
                        input: context.config.build.bundle.main,
                        plugins: [
                            (0, plugin_node_resolve_1["default"])({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.json', '.mjs', '.cjs'], moduleDirectories: ['node_modules'] }),
                            (0, plugin_json_1["default"])(),
                            (0, plugin_commonjs_1["default"])(),
                            (0, plugin_babel_1["default"])(babelConf),
                            {
                                name: 'listr-output',
                                transform: function (code) {
                                    task.output = "Condensing... (".concat(++count, " file").concat(count === 1 ? '' : 's', ")");
                                    return { code: code, map: null };
                                }
                            }
                        ],
                        onwarn: function (warning) {
                            btask.stdout().write(warning.message + '\n');
                        },
                        output: {
                            minifyInternalExports: false,
                            sourcemap: context.config.build.bundle.sourcemaps === true,
                            format: 'iife'
                        }
                    }).pipe((0, vinyl_source_stream_1["default"])('bundle.js'))
                        .pipe((0, vinyl_buffer_1["default"])());
                    return context.pour(bundle, 'bundle');
                },
                options: { bottomBar: Infinity, persistentOutput: true }
            },
            {
                title: 'Compress bundle',
                task: function (context) {
                    var bundle = context.serve('bundle');
                    task.output = 'Compressing...';
                    if (context.config.build.bundle.sourcemaps === true)
                        bundle = bundle.pipe(gulp_sourcemaps_1["default"].init({ loadMaps: true }));
                    bundle = bundle.pipe((0, gulp_terser_1["default"])({ output: { comments: false }, compress: true, mangle: true }));
                    if (context.config.build.bundle.sourcemaps === true)
                        bundle = bundle.pipe(gulp_sourcemaps_1["default"].write('.', { sourceRoot: path_1["default"].relative(context.config.build.out, path_1["default"].dirname(context.config.build.bundle.main)) }));
                    return context.pour(bundle, 'bundle');
                },
                enabled: function (context) { return context.config.build.bundle.minify === true; }
            },
            {
                task: function (context) {
                    task.output = 'Done!';
                    context.pour(context.serve('bundle'), 'dest');
                }
            }
        ], { concurrent: false, rendererOptions: { collapse: false } });
    }
};
