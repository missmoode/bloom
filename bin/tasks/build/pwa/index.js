"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyServiceWorker = exports.copyHTML = exports.generateWebManifest = void 0;
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const vinyl_1 = __importDefault(require("vinyl"));
const context_1 = require("../../context");
const gulp_template_1 = __importDefault(require("gulp-template"));
const vinyl_fs_1 = require("vinyl-fs");
const fs_1 = require("fs");
// write json object to vinyl file
function writeJson(obj, fileName) {
    const file = new vinyl_1.default({
        contents: Buffer.from(JSON.stringify(obj)),
        path: fileName
    });
    return file;
}
exports.generateWebManifest = {
    title: 'Generate Web Manifest (PWA)',
    task: (context, task) => {
        const manifest = {
            name: context.config.name,
            background_color: context.config.presentation.themeColor,
            theme_color: context.config.presentation.themeColor,
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/',
            icons: [
                {
                    src: path_1.default.basename(context.config.presentation.icon),
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
        const manifestStream = new stream_1.PassThrough({ objectMode: true });
        manifestStream.end(writeJson(manifest, 'manifest.webmanifest'));
        return (0, context_1.stageFiles)(context, manifestStream);
    },
    enabled: (context) => context.platform === 'pwa'
};
function list(directory) {
    const files = (0, fs_1.readdirSync)(directory);
    const result = [];
    for (const file of files) {
        const fullPath = path_1.default.join(directory, file);
        if ((0, fs_1.statSync)(fullPath).isDirectory()) {
            result.push(...list(fullPath));
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
    const files = list(base);
    const result = [];
    for (const file of files) {
        if ((0, fs_1.statSync)(file).isDirectory()) {
            result.push(`/${path_1.default.relative(base, file)}/`.replace('//', '/'));
        }
        else {
            result.push(`/${path_1.default.relative(base, file)}`);
        }
    }
    result.push('/');
    return result;
}
exports.copyHTML = {
    title: 'Drop in HTML template (PWA)',
    task: (context, task) => {
        const html = (0, vinyl_fs_1.src)(`${__dirname}${path_1.default.sep}service-worker.js`)
            .pipe((0, gulp_template_1.default)({ title: context.config.name, favicon: './favicon.png', touch_icon: './touch-icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
        return (0, context_1.stageFiles)(context, html);
    },
    enabled: (context) => context.platform === 'pwa'
};
exports.copyServiceWorker = {
    title: 'Drop in Service Worker template (PWA)',
    task: (context, task) => {
        const sw = (0, vinyl_fs_1.src)(`${__dirname}${path_1.default.sep}service-worker.js`)
            .pipe((0, gulp_template_1.default)({ cache: JSON.stringify(mapFilesRecursive(context.config.build.out)), cache_name: `"${Date.now()}"` }, { interpolate: /'{{([\s\S]+?)}}'/gs }));
        return (0, context_1.stageFiles)(context, sw);
    },
    enabled: (context) => context.platform === 'pwa'
};
