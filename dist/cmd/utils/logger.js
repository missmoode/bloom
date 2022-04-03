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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
var misc_1 = require("./misc");
var chalk_1 = __importDefault(require("chalk"));
var levels = ['debug', 'info', 'warn', 'error'];
function messageToString(message) {
    var _a;
    if (message.content.includes('\n')) {
        var lines_1 = message.content.split('\n')
            .filter(function (s, i, a) { return s.length > 0 || i < a.length - 1; });
        if (lines_1.length > 1) {
            return lines_1.map(function (line, index) { return "".concat(chalk_1.default.yellow(index == 0 ? '╭' : index == lines_1.length - 1 ? '╰' : '│'), " ").concat(line); })
                .map(function (content) { return messageToString(__assign(__assign({}, message), { content: content })); })
                .join('\n');
        }
        else {
            return messageToString(__assign(__assign({}, message), { content: lines_1[0] }));
        }
    }
    else {
        return "".concat((0, misc_1.pad)((_a = message.premoji) !== null && _a !== void 0 ? _a : '◌', 3)).concat(formatDomain(message.domain), " ").concat(chalk_1.default.reset.yellowBright.bold('│'), " ").concat(message.content);
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
function formatDomain(domain, length) {
    if (length === void 0) { length = 16; }
    var str = (0, misc_1.pad)(domain, length, true);
    if (domain) {
        var split = str.lastIndexOf('›');
        var ellipsis = str.includes('‥');
        if (split > -1) {
            str = chalk_1.default.reset.cyan(str.slice(ellipsis ? 1 : 0, split)) + chalk_1.default.reset.white('›') + chalk_1.default.reset.cyanBright.bold(str.slice(split + 1));
        }
        else {
            str = chalk_1.default.reset.cyanBright.bold(str.slice(ellipsis ? 1 : 0));
        }
        if (ellipsis)
            str = chalk_1.default.reset.cyan('‥') + str;
    }
    else {
        str = chalk_1.default.reset.white('⋯'.repeat(length));
    }
    return str;
}
function createLogger(domain) {
    var funcs = levels
        .map(function (level) { return createLogFunction(level, domain); })
        .reduce(function (prev, func, i) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a[levels[i]] = func, _a)));
    }, {});
    return __assign({ domain: domain, createLogger: function (subdomain) { return createLogger(subdomain ? domain ? "".concat(domain, "\u203A").concat(subdomain) : subdomain : domain); } }, funcs);
}
exports.createLogger = createLogger;
