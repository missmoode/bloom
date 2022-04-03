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
var colors_1 = require("./colors");
var levels = ['debug', 'info', 'warn', 'error'];
function messageToString(message) {
    var _a;
    if (message.content.includes('\n')) {
        var lines_1 = message.content.split('\n')
            .filter(function (s, i, a) { return s.length > 0 || i < a.length - 1; });
        if (lines_1.length > 1) {
            return lines_1.map(function (line, index) { return "".concat(colors_1.Color.FgMagenta).concat(index == 0 ? '╭' : index == lines_1.length - 1 ? '╰' : '│').concat(colors_1.Color.Reset, " ").concat(line); })
                .map(function (content) { return messageToString(__assign(__assign({}, message), { content: content })); })
                .join('\n');
        }
        else {
            return messageToString(__assign(__assign({}, message), { content: lines_1[0] }));
        }
    }
    else {
        return "".concat(pad((_a = message.premoji) !== null && _a !== void 0 ? _a : '◌', 3)).concat(colors_1.Color.FgMagenta).concat(colors_1.Color.Bright).concat(message.domain ? "".concat(pad(message.domain, 23)) : '', "  ").concat(colors_1.Color.Reset).concat(message.content).concat(colors_1.Color.Reset);
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
    return __assign({ domain: domain, createLogger: function (subdomain) { return createLogger(subdomain ? domain ? "".concat(domain, " \u00BB ").concat(subdomain) : subdomain : domain); } }, funcs);
}
exports.createLogger = createLogger;
// pad a string or restrict it to a certain length
// when restricting it, do so from the left and include an ellipsis, e.g. "foo" => "...foo"
// pad with spaces
function pad(str, length) {
    if (str.length > length) {
        return "...".concat(str.slice(-length + 3));
    }
    else {
        return "".concat(str).concat(' '.repeat(length - str.length));
    }
}
