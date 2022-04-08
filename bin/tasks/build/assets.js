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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareAssets = void 0;
const vinyl_fs_1 = require("vinyl-fs");
const context_1 = require("../context");
exports.prepareAssets = {
    title: 'Prepare Assets',
    task: (context, task) => task.newListr([
        {
            title: 'Stage resources',
            task: (context, task) => (0, context_1.stageFiles)(context, (0, vinyl_fs_1.src)(context.config.build.assets.resources))
        },
        {
            title: 'Stage icon',
            task: (context, task) => __awaiter(void 0, void 0, void 0, function* () {
                (0, context_1.stageFiles)(context, (0, vinyl_fs_1.src)(context.config.presentation.icon));
            }),
            enabled: (context) => context.platform === 'pwa'
        }
    ], { concurrent: true })
};
