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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = void 0;
const stream_1 = __importDefault(require("@rollup/stream"));
const plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const vinyl_source_stream_1 = __importDefault(require("vinyl-source-stream"));
const vinyl_buffer_1 = __importDefault(require("vinyl-buffer"));
const path_1 = __importDefault(require("path"));
const gulp_terser_1 = __importDefault(require("gulp-terser"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const gulp_sourcemaps_1 = __importDefault(require("gulp-sourcemaps"));
exports.bundle = {
    title: 'Create bundle',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: (context, task) => task.newListr([
        {
            title: 'Condense source',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            task: (context, btask) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                var _b;
                const babelConf = {
                    extensions: ['.ts', '.js'],
                    presets: ['@babel/preset-typescript', '@babel/preset-env'],
                    babelrc: false,
                    babelHelpers: 'bundled'
                };
                let count = 0;
                const bundle = (0, stream_1.default)({
                    input: context.config.build.bundle.main,
                    cache: (_a = (_b = context.data).rollupCache) !== null && _a !== void 0 ? _a : (_b.rollupCache = {}),
                    plugins: [
                        (0, plugin_node_resolve_1.default)({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.json', '.mjs', '.cjs'], moduleDirectories: ['node_modules'] }),
                        (0, plugin_json_1.default)(),
                        (0, plugin_commonjs_1.default)(),
                        (0, plugin_babel_1.default)(babelConf),
                        {
                            name: 'listr-output',
                            transform(code) {
                                task.output = `Condensing... (${++count} file${count === 1 ? '' : 's'})`;
                                return { code, map: null };
                            }
                        }
                    ],
                    onwarn(warning) {
                        btask.stdout().write(warning.message + '\n');
                    },
                    output: {
                        minifyInternalExports: false,
                        sourcemap: context.config.build.bundle.sourcemaps === true,
                        format: 'iife',
                    }
                }).pipe((0, vinyl_source_stream_1.default)('bundle.js'))
                    .pipe((0, vinyl_buffer_1.default)());
                yield context.relay('bundle').ingest(bundle);
            }),
            options: { bottomBar: Infinity, persistentOutput: true }
        },
        {
            title: 'Compress bundle',
            task: (context) => __awaiter(void 0, void 0, void 0, function* () {
                const bundle = context.relay('bundle');
                task.output = 'Compressing...';
                if (context.config.build.bundle.sourcemaps === true)
                    yield bundle.cycle(gulp_sourcemaps_1.default.init({ loadMaps: true }));
                yield bundle.cycle((0, gulp_terser_1.default)({ output: { comments: false }, compress: true, mangle: { properties: false } }));
                if (context.config.build.bundle.sourcemaps === true)
                    yield bundle.cycle(gulp_sourcemaps_1.default.write('.', { sourceRoot: path_1.default.relative(context.config.build.out, path_1.default.dirname(context.config.build.bundle.main)) }));
            }),
            enabled: (context) => context.config.build.bundle.minify === true
        },
        {
            task: (context) => __awaiter(void 0, void 0, void 0, function* () {
                task.output = 'Copying to artefacts...';
                yield context.artefacts.ingest(context.relay('bundle').flush);
                task.output = 'Done!';
            })
        }
    ], { concurrent: false, rendererOptions: { collapse: false } })
};
