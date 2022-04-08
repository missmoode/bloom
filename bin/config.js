"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommandLineOption = exports.getDescription = exports.getValue = exports.setValue = exports.populateConfiguration = void 0;
const assert_1 = __importDefault(require("assert"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const optionSchema = {
    name: [path_1.default.basename(process.cwd()), 'The name of the game, used in the title bar and in the manifest'],
    presentation: {
        icon: `${path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/icon.svg'))}`,
        themeColor: '#ffffff',
    },
    build: {
        clean: true,
        out: ['dist', 'The directory the final build will be placed in'],
        assets: {
            resources: `${path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/**/*'))}`,
        },
        bundle: {
            main: [`${path_1.default.join(process.cwd(), 'src/app/app.ts')}`, 'The path of the main bundle file'],
            minify: [false, 'Whether to minify the bundle'],
            sourcemaps: [false, 'Whether to generate sourcemaps']
        }
    }
};
function resolveConfiguration(set, defaults = optionSchema, resolutions) {
    var _a, _b, _c;
    const root = !resolutions;
    if (!resolutions) {
        resolutions = [];
    }
    const out = {};
    for (const key of Object.keys(defaults)) {
        const value = defaults[key];
        if (value instanceof Array) {
            (_a = set[key]) !== null && _a !== void 0 ? _a : (set[key] = value[0]);
        }
        else if (value instanceof Function) {
            resolutions.push((opts) => { var _a; (_a = set[key]) !== null && _a !== void 0 ? _a : (set[key] = value(opts)); });
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            (_b = set[key]) !== null && _b !== void 0 ? _b : (set[key] = value);
        }
        else {
            set[key] = resolveConfiguration((_c = set[key]) !== null && _c !== void 0 ? _c : {}, value, resolutions);
        }
    }
    if (root) {
        resolutions.forEach(fn => fn(out));
    }
    return set;
}
function populateConfiguration(set) {
    return resolveConfiguration(set);
}
exports.populateConfiguration = populateConfiguration;
function setValue(configuration, key, value) {
    const parts = key.split('.');
    const last = parts.pop();
    const obj = parts.reduce((o, k) => o[k], configuration);
    (0, assert_1.default)(last, `Invalid option key: ${key}`);
    obj[last] = value;
}
exports.setValue = setValue;
function getValue(configuration, key) {
    const parts = key.split('.');
    const last = parts.pop();
    const obj = parts.reduce((o, k) => o[k], configuration);
    (0, assert_1.default)(last, `Invalid option key: ${key}`);
    return obj[last];
}
exports.getValue = getValue;
function getDescription(key) {
    const parts = key.split('.');
    const last = parts.pop();
    const obj = parts.reduce((o, k) => o[k], optionSchema);
    (0, assert_1.default)(last, `Invalid option key: ${key}`);
    const value = obj[last];
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
function GetCommandLineOption(config, key, flags = `--${dashCase(key)}`) {
    const previous = getValue(config, key);
    return new commander_1.Option(`${flags}${typeof previous === 'string' ? ' <value>' : typeof previous === 'number' ? ' <number>' : ''}`, getDescription(key)).default(previous)
        .argParser((value) => {
        if (typeof previous === 'string') {
            return setValue(config, key, value);
        }
        else if (typeof previous === 'number') {
            if (!isNaN(Number(value))) {
                setValue(config, key, Number(value));
            }
            else {
                throw new commander_1.InvalidOptionArgumentError(`Invalid number: ${value}`);
            }
        }
        else if (typeof previous === 'boolean') {
            setValue(config, key, true);
        }
        else {
            throw new commander_1.InvalidOptionArgumentError(`Invalid option type for ${key}: ${typeof previous}`);
        }
    });
}
exports.GetCommandLineOption = GetCommandLineOption;
