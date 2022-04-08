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
exports.__esModule = true;
exports.build = exports.prepareAssets = exports.bundle = void 0;
var assets_1 = require("./assets");
var bundle_1 = require("./bundle");
var pwa = __importStar(require("./pwa"));
var verify_1 = require("./verify");
var bundle_2 = require("./bundle");
__createBinding(exports, bundle_2, "bundle");
var assets_2 = require("./assets");
__createBinding(exports, assets_2, "prepareAssets");
exports.build = {
    title: 'Build',
    task: function (context, task) {
        return task.newListr([
            verify_1.verify,
            {
                task: function (context, task) { return task.newListr([
                    bundle_1.bundle,
                    assets_1.prepareAssets,
                    pwa.generateWebManifest,
                    pwa.copyHTML,
                    pwa.copyServiceWorker
                ], { concurrent: false }); }
            }
        ], { concurrent: false });
    }
};
