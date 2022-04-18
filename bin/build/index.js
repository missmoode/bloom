"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.Context = exports.Targets = void 0;
const listr2_1 = require("listr2");
const pack_1 = require("./pack");
// Multiple task lists may have common tasks.
// Up until the task lists diverge, we only need to run the common tasks once.
// We can visualise this as a tree of tasks.
// The root of the tree is the common tasks.
// For example, if the task lists are [A, B, C, E, F], [A, B, C, D, E, F], and [A, B, Z, E, F], then the resulting tree is [A, B, [[C, [[E, F], [D, E, F]]], [Z, E, F]]]
// When the task lists diverge, we should give each subtree
var pack_2 = require("./pack");
Object.defineProperty(exports, "Targets", { enumerable: true, get: function () { return pack_2.Targets; } });
var context_1 = require("./context");
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return context_1.Context; } });
function build(target) {
    return new listr2_1.Listr((0, pack_1.getTaskList)(target), { concurrent: false, rendererOptions: { collapse: false, showTimer: true } });
}
exports.build = build;
