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
exports.output = void 0;
const path_1 = require("path");
const vinyl_fs_1 = require("vinyl-fs");
function output(dir) {
    return {
        title: 'Save to output',
        task: (context, task) => __awaiter(this, void 0, void 0, function* () {
            const output = (0, path_1.join)(context.config.build.out, dir || '');
            task.output = `Saving to ${output}...`;
            const count = context.artefacts.count;
            yield context.artefacts.flush.writeTo((0, vinyl_fs_1.dest)(output));
            task.output = `Saved ${count} artefact${count === 1 ? '' : 's'} to ${output}`;
        })
    };
}
exports.output = output;
