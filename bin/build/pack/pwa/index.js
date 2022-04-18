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
exports.pwa = void 0;
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const vinyl_1 = __importDefault(require("vinyl"));
const gulp_template_1 = __importDefault(require("gulp-template"));
const vinyl_fs_1 = require("vinyl-fs");
const icon = {
    title: 'Stage icon',
    task: (context) => __awaiter(void 0, void 0, void 0, function* () {
        yield context.artefacts.ingest((0, vinyl_fs_1.src)(context.config.presentation.icon));
    })
};
// write json object to vinyl file
function writeJson(obj, fileName) {
    const file = new vinyl_1.default({
        contents: Buffer.from(JSON.stringify(obj)),
        path: fileName
    });
    return file;
}
const generateWebManifest = {
    title: 'Generate Web Manifest',
    task: (context) => __awaiter(void 0, void 0, void 0, function* () {
        const manifest = {
            name: context.config.productName,
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
        yield context.artefacts.ingest(manifestStream);
    })
};
const copyHTML = {
    title: 'Drop in HTML template',
    task: (context) => __awaiter(void 0, void 0, void 0, function* () {
        const html = (0, vinyl_fs_1.src)(`${__dirname}${path_1.default.sep}index.html`)
            .pipe((0, gulp_template_1.default)({ title: context.config.productName, favicon: './app_icon.png', touch_icon: './app_icon.png', theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
        yield context.artefacts.ingest(html);
    })
};
const copyServiceWorker = {
    title: 'Drop in Service Worker template',
    task(context) {
        const fileMap = new Set();
        for (const file of context.artefacts) {
            if (file.relative.includes('.') && !fileMap.has(file.relative))
                fileMap.add(file.relative);
        }
        const sw = (0, vinyl_fs_1.src)(`${__dirname}${path_1.default.sep}service-worker.js`)
            .pipe((0, gulp_template_1.default)({ cache: JSON.stringify([...fileMap]), cache_name: `"${Date.now()}"` }, { interpolate: /'{{([\s\S]+?)}}'/gs }));
        return context.artefacts.ingest(sw);
    }
};
exports.pwa = {
    tasks: [icon, generateWebManifest, copyHTML, copyServiceWorker]
};
