"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = exports.task = void 0;
// Adapt a stream to a promise
function asPromise(stream) {
    return new Promise(function (resolve, reject) {
        stream.on("end", function () { return resolve(); });
        stream.on("error", function (error) { return reject(error); });
    });
}
// Test if a value is a NodeJS.ReadWriteStream or a Promise
function isStream(value) {
    return value && typeof value.pipe === "function";
}
function pretty(str) {
    return str.charAt(0).toUpperCase + str.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2');
}
function task(fn, name) {
    if (name === void 0) { name = pretty(fn.name); }
    var out = function (logger, config) {
        var taskLogger = logger.createLogger(name);
        taskLogger.info('Starting task...', '🚀');
        var ret = fn(logger, config);
        if (isStream(ret)) {
            ret = asPromise(ret);
        }
        ret.then(function () { taskLogger.info('Task finished!', '🎉'); });
        ret.catch(function (error) { taskLogger.error(error.message, '💥'); process.exit(1); });
        return ret;
    };
    return out;
}
exports.task = task;
function sequence() {
    var tasks = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tasks[_i] = arguments[_i];
    }
    return function (logger, config) {
        return tasks.reduce(function (prev, task) {
            return prev.then(function () { return task(logger, config); });
        }, Promise.resolve());
    };
}
exports.sequence = sequence;
