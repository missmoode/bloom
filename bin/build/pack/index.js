"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Targets = exports.getTaskList = void 0;
const target_1 = require("./target");
const output_1 = require("../common/output");
const bundle_1 = require("../common/bundle");
const assets_1 = require("../common/assets");
function getTaskList(target) {
    return [
        bundle_1.bundle,
        assets_1.resources,
        ...target_1.Targets[target].tasks,
        (0, output_1.output)()
    ];
}
exports.getTaskList = getTaskList;
var target_2 = require("./target");
Object.defineProperty(exports, "Targets", { enumerable: true, get: function () { return target_2.TargetNames; } });
