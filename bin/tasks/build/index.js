"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.prepareAssets = exports.bundle = void 0;
const assets_1 = require("./assets");
const bundle_1 = require("./bundle");
const pwa = __importStar(require("./pwa"));
const verify_1 = require("./verify");
var bundle_2 = require("./bundle");
Object.defineProperty(exports, "bundle", { enumerable: true, get: function () { return bundle_2.bundle; } });
var assets_2 = require("./assets");
Object.defineProperty(exports, "prepareAssets", { enumerable: true, get: function () { return assets_2.prepareAssets; } });
exports.build = {
    title: 'Build',
    task: (context, task) => task.newListr([
        verify_1.verify,
        {
            task: (context, task) => task.newListr([
                bundle_1.bundle,
                assets_1.prepareAssets,
                pwa.generateWebManifest,
                pwa.copyHTML,
                pwa.copyServiceWorker
            ], { concurrent: false })
        }
    ], { concurrent: false })
};
