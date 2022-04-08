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
exports.verify = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const context_1 = require("../context");
exports.verify = {
    title: 'Verify build settings',
    task: (context, task) => task.newListr((parent) => [
        {
            title: 'Check platform',
            task: (context, task) => __awaiter(void 0, void 0, void 0, function* () {
                if (!context.platform) {
                    yield task.prompt({
                        type: 'Select',
                        message: 'Select platform',
                        required: true,
                        choices: [...context_1.Platforms],
                        result: (value) => {
                            context.platform = value;
                        }
                    });
                }
                task.title = `Platform: ${context.platform}`;
            })
        },
        {
            title: 'Verify entry point',
            task: () => (0, promises_1.access)(context.config.build.bundle.main, fs_1.constants.F_OK),
        },
        {
            title: 'Verify icon exists',
            task: () => (0, promises_1.access)(context.config.presentation.icon, fs_1.constants.F_OK),
            enabled: (context) => context.platform === 'pwa'
        }
    ])
};
