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
exports.Relay = exports.Source = exports.Sink = void 0;
const stream_1 = require("stream");
class Sink extends stream_1.Writable {
    constructor(fn) {
        super({ objectMode: true });
        this.fn = fn;
    }
    _write(chunk, encoding, next) {
        this.fn(chunk, encoding);
        next();
    }
    fill(source) {
        return new Promise((resolve, reject) => {
            // piping it through a passthrough because vinyl-buffer doesn't seem to finish constructing vinyl objects without this
            source = source.pipe(new stream_1.PassThrough({ objectMode: true }));
            source.on('error', reject);
            source.on('end', resolve);
            source.pipe(this);
        });
    }
}
exports.Sink = Sink;
class Source extends stream_1.Readable {
    constructor(objects) {
        super({ objectMode: true });
        this.objects = objects;
    }
    _read() {
        var _a;
        this.push((_a = this.objects.shift()) !== null && _a !== void 0 ? _a : null);
    }
    writeTo(dest) {
        return new Promise((resolve, reject) => {
            this.on('error', reject);
            this.on('end', resolve);
            this.pipe(dest);
        });
    }
}
exports.Source = Source;
/**
 * A store for objects in an object stream
 * @template T the type of object to store
 */
class Relay {
    constructor() {
        this.objects = [];
    }
    /**
     * Exposes a new sink which can be used to add objects to the relay
     */
    get in() {
        return new Sink((chunk) => this.objects.push(chunk));
    }
    /**
     * Exposes a new source which can be used to read objects from the relay
     */
    get out() {
        return new Source(JSON.parse(JSON.stringify(this.objects)));
    }
    /**
     * Empties the relay and exposes a final source with all the objects
     */
    get flush() {
        const objects = this.objects;
        this.objects = [];
        return new Source(objects);
    }
    cycle(transform) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.in.fill(this.flush.pipe(transform));
            return this;
        });
    }
    [Symbol.iterator]() {
        return this.objects[Symbol.iterator]();
    }
    get count() {
        return this.objects.length;
    }
    ingest(source) {
        return this.in.fill(source);
    }
    writeTo(dest) {
        return this.out.writeTo(dest);
    }
}
exports.Relay = Relay;
