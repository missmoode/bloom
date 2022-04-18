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
exports.Context = void 0;
const streams_1 = require("../util/streams");
class Context {
    constructor(config) {
        this.data = {};
        this.streams = {};
        this.config = config;
    }
    relay(key) {
        var _a;
        var _b;
        return (_a = (_b = this.streams)[key]) !== null && _a !== void 0 ? _a : (_b[key] = new streams_1.Relay());
    }
    get artefacts() {
        var _a;
        var _b;
        return (_a = (_b = this.streams)['artefacts']) !== null && _a !== void 0 ? _a : (_b['artefacts'] = new streams_1.Relay());
    }
    clone() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = new Context(this.config);
            context.data = JSON.parse(JSON.stringify(this.data));
            for (const key in this.streams) {
                yield this.relay(key).in.fill(this.streams[key].out);
            }
            return context;
        });
    }
}
exports.Context = Context;
