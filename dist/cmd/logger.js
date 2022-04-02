"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
var levels = ['debug', 'info', 'warn', 'error'];
function messageToString(message) {
    if (message.content.includes('\n')) {
        var lines_1 = message.content.split('\n')
            .filter(function (s, i, a) { return s.length > 0 || i < a.length - 1; });
        if (lines_1.length > 1) {
            return lines_1.map(function (line, index) { return "".concat(index == 0 ? '╭' : index == lines_1.length - 1 ? '╰' : '│', " ").concat(line); })
                .map(function (content) { return messageToString(__assign(__assign({}, message), { content: content })); })
                .join('\n');
        }
        else {
            return messageToString(__assign(__assign({}, message), { content: lines_1[0] }));
        }
    }
    else {
        return "".concat(message.premoji ? "".concat(message.premoji, "  ") : '').concat(message.domain ? "".concat(message.domain, "  ") : '').concat(message.content);
    }
}
function log(level, message) {
    console[level](messageToString(message));
}
function createLogFunction(level, domain) {
    return function (content, premoji) {
        log(level, { domain: domain, content: content, premoji: premoji });
    };
}
function createLogger(domain) {
    var funcs = levels
        .map(function (level) { return createLogFunction(level, domain); })
        .reduce(function (prev, func, i) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a[levels[i]] = func, _a)));
    }, {});
    return __assign({ createLogger: function (subdomain) { return createLogger(subdomain ? domain ? "".concat(domain, "/").concat(subdomain) : subdomain : domain); } }, funcs);
}
exports.createLogger = createLogger;
