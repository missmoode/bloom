"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = exports.task = void 0;
// Adapt a stream to a promise
function asPromise(stream) {
    return new Promise(function (resolve, reject) {
        stream.on('end', function () { return resolve(); });
        stream.on('error', function (error) { return reject(error); });
    });
}
// Test if a value is a NodeJS.ReadWriteStream or a Promise
function isStream(value) {
    return value && typeof value.pipe === 'function';
}
function task(fn) {
    var _a;
    (_a = fn.displayName) !== null && _a !== void 0 ? _a : (fn.displayName = fn.name);
    var out = function (logger, config) {
        var taskLogger = logger.createLogger(fn.displayName);
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
// Take series of tasks and return a task which runs them in sequence
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
