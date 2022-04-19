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
exports.html = void 0;
const path_1 = __importDefault(require("path"));
const gulp_template_1 = __importDefault(require("gulp-template"));
const vinyl_fs_1 = require("vinyl-fs");
const copyHTML = {
    title: 'Drop in HTML template',
    task: (context) => __awaiter(void 0, void 0, void 0, function* () {
        const html = (0, vinyl_fs_1.src)(`${__dirname}${path_1.default.sep}index.html`)
            .pipe((0, gulp_template_1.default)({ title: context.config.productName, theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));
        yield context.artefacts.ingest(html);
    })
};
exports.html = {
    tasks: [copyHTML]
};
