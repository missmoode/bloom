"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommandLineOption = exports.getDescription = exports.getValue = exports.setValue = exports.populateConfiguration = void 0;
const commander_1 = require("commander");
const assert_1 = __importDefault(require("assert"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const implPackageFile = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(process.cwd(), 'package.json')).toString('utf-8'));
const inferredDefaultMain = implPackageFile.main && implPackageFile.main.endsWith('.ts') ? implPackageFile.main : 'src/app/main.ts';
// Convert snake_case or kebab-case or UpperCamelCase to Noun Case
const toNounCase = (str) => str.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const optionSchema = {
    productName: [toNounCase((_a = implPackageFile.name) !== null && _a !== void 0 ? _a : path_1.default.basename(process.cwd())), 'The name of the game, used in the title bar and in the manifest'],
    appVersion: [(_b = implPackageFile.version) !== null && _b !== void 0 ? _b : '0.0.1', 'The version of the game'],
    presentation: {
        icon: `${path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/icon.svg'))}`,
        themeColor: '#ffffff',
    },
    build: {
        out: ['dist', 'The directory the final build will be placed in'],
        assets: {
            resources: `${path_1.default.resolve(process.cwd(), path_1.default.join(process.cwd(), 'src/resources/**/*'))}`,
        },
        bundle: {
            main: [`${path_1.default.relative(process.cwd(), path_1.default.join(process.cwd(), inferredDefaultMain))}`, 'The path of the bundle entry file'],
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
function populateConfiguration(...set) {
    return resolveConfiguration(Object.assign({}, ...set));
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
    const preset = getValue(config, key);
    const opt = new commander_1.Option(`${flags}${typeof preset === 'string' ? ' <value>' : typeof preset === 'number' ? ' <number>' : Array.isArray(preset) ? ' <targets...>' : ''}`, getDescription(key)).default(preset)
        .argParser((value) => {
        if (typeof preset === 'string') {
            return setValue(config, key, value);
        }
        else if (typeof preset === 'number') {
            if (!isNaN(Number(value))) {
                setValue(config, key, Number(value));
            }
            else {
                throw new commander_1.InvalidOptionArgumentError(`Invalid number: ${value}`);
            }
        }
        else if (typeof preset === 'boolean') {
            setValue(config, key, true);
        }
        else if (Array.isArray(preset)) {
            setValue(config, key, value);
        }
        else {
            throw new commander_1.InvalidOptionArgumentError(`Invalid option type for ${key}: ${typeof preset}`);
        }
    });
    return opt;
}
exports.GetCommandLineOption = GetCommandLineOption;
