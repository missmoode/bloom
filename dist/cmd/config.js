"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommandLineOption = exports.getDescription = exports.getValue = exports.setValue = exports.populateConfiguration = void 0;
var assert_1 = __importDefault(require("assert"));
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var optionSchema = {
    name: [path_1.default.basename(process.cwd()), 'The name of the game, used in the title bar and in the manifest'],
    presentation: {
        icon: "".concat(path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/icon.svg'))),
        themeColor: '#ffffff',
    },
    build: {
        clean: true,
        out: ['dist', 'The directory the final build will be placed in'],
        assets: {
            resources: "".concat(path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/**/*'))),
        },
        bundle: {
            main: ["".concat(path_1.default.join(process.cwd(), 'src/resources')), 'The path of the main bundle file'],
            minify: [false, 'Whether to minify the bundle'],
            sourcemaps: [false, 'Whether to generate sourcemaps']
        }
    }
};
function resolveConfiguration(set, defaults, resolutions) {
    var _a, _b, _c;
    if (defaults === void 0) { defaults = optionSchema; }
    var root = !resolutions;
    if (!resolutions) {
        resolutions = [];
    }
    var out = {};
    var _loop_1 = function (key) {
        var value = defaults[key];
        if (value instanceof Array) {
            (_a = set[key]) !== null && _a !== void 0 ? _a : (set[key] = value[0]);
        }
        else if (value instanceof Function) {
            resolutions.push(function (opts) { var _a; (_a = set[key]) !== null && _a !== void 0 ? _a : (set[key] = value(opts)); });
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            (_b = set[key]) !== null && _b !== void 0 ? _b : (set[key] = value);
        }
        else {
            set[key] = resolveConfiguration((_c = set[key]) !== null && _c !== void 0 ? _c : {}, value, resolutions);
        }
    };
    for (var _i = 0, _d = Object.keys(defaults); _i < _d.length; _i++) {
        var key = _d[_i];
        _loop_1(key);
    }
    if (root) {
        resolutions.forEach(function (fn) { return fn(out); });
    }
    return set;
}
function populateConfiguration(set) {
    return resolveConfiguration(set);
}
exports.populateConfiguration = populateConfiguration;
function setValue(configuration, key, value) {
    var parts = key.split('.');
    var last = parts.pop();
    var obj = parts.reduce(function (o, k) { return o[k]; }, configuration);
    (0, assert_1.default)(last, "Invalid option key: ".concat(key));
    obj[last] = value;
}
exports.setValue = setValue;
function getValue(configuration, key) {
    var parts = key.split('.');
    var last = parts.pop();
    var obj = parts.reduce(function (o, k) { return o[k]; }, configuration);
    (0, assert_1.default)(last, "Invalid option key: ".concat(key));
    return obj[last];
}
exports.getValue = getValue;
function getDescription(key) {
    var parts = key.split('.');
    var last = parts.pop();
    var obj = parts.reduce(function (o, k) { return o[k]; }, optionSchema);
    (0, assert_1.default)(last, "Invalid option key: ".concat(key));
    var value = obj[last];
    if (value instanceof Array) {
        return value[1];
    }
    else {
        return undefined;
    }
}
exports.getDescription = getDescription;
// camelCase to dash-case
function dashCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function GetCommandLineOption(config, key, flags) {
    if (flags === void 0) { flags = "--".concat(dashCase(key)); }
    var previous = getValue(config, key);
    return new commander_1.Option("".concat(flags).concat(typeof previous === 'string' ? ' <value>' : typeof previous === 'number' ? ' <number>' : ''), getDescription(key)).default(previous)
        .argParser(function (value) {
        if (typeof previous === 'string') {
            return setValue(config, key, value);
        }
        else if (typeof previous === 'number') {
            if (!isNaN(Number(value))) {
                setValue(config, key, Number(value));
            }
            else {
                throw new commander_1.InvalidOptionArgumentError("Invalid number: ".concat(value));
            }
        }
        else if (typeof previous === 'boolean') {
            setValue(config, key, true);
        }
        else {
            throw new commander_1.InvalidOptionArgumentError("Invalid option type for ".concat(key, ": ").concat(typeof previous));
        }
    });
}
exports.GetCommandLineOption = GetCommandLineOption;
