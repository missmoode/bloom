"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.prepareAssets = exports.bundle = void 0;
var assets_1 = require("./assets");
var bundle_1 = require("./bundle");
var verify_1 = require("./verify");
var bundle_2 = require("./bundle");
Object.defineProperty(exports, "bundle", { enumerable: true, get: function () { return bundle_2.bundle; } });
var assets_2 = require("./assets");
Object.defineProperty(exports, "prepareAssets", { enumerable: true, get: function () { return assets_2.prepareAssets; } });
exports.build = {
    title: 'Build',
    task: function (context, task) {
        return task.newListr([
            verify_1.verify,
            {
                task: function (context, task) { return task.newListr([
                    bundle_1.bundle,
                    assets_1.prepareAssets
                ], { concurrent: true }); }
            }
        ], { concurrent: false });
    }
};
