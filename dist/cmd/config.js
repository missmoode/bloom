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
exports.resolve = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var logger_1 = require("./logger");
var logger = (0, logger_1.createLogger)("config");
function resolve(options) {
    var config = __assign({}, options);
    if ((0, fs_1.existsSync)(options.config)) {
        config = __assign(__assign({}, config), JSON.parse((0, fs_1.readFileSync)(options.config).toString('utf-8')));
    }
    return inferMissing(config);
}
exports.resolve = resolve;
function inferMissing(input) {
    var config = __assign({}, input);
    if ((0, fs_1.existsSync)('package.json')) {
        var packageFile = JSON.parse((0, fs_1.readFileSync)('package.json').toString('utf-8'));
        if (!config.name && packageFile.name) {
            config.name = packageFile.name.replace(/([-_])/g, ' ').replace(/((?<=^|\s)[\S])/g, function (s) { return s.toUpperCase(); });
            logger.debug("Inferred name \"".concat(config.name, "\" from package.json"), '💡');
        }
        if (!config.description && packageFile.description) {
            config.description = packageFile.description;
            logger.debug("Inferred description from package.json", '💡');
        }
        if (!config.applicationRoot && packageFile.main && packageFile.main.endsWith('.ts')) {
            config.applicationRoot = packageFile.main;
            logger.debug("Inferred application root from package.json", '💡');
        }
        if (!config.icon && packageFile.icon) {
            config.icon = packageFile.icon;
            logger.debug("Using inferred icon from package.json", '💡');
        }
        if (!config.themeColor && packageFile.themeColor) {
            config.themeColor = packageFile.themeColor;
            logger.debug("Using theme color from package.json", '💡');
        }
        if (!config.resources && packageFile.resources) {
            config.resources = packageFile.resources;
            logger.debug("Using resources from package.json", '💡');
        }
    }
    if (!config.name) {
        config.name = (0, path_1.basename)(process.cwd());
        logger.warn("Inferred name \"".concat(config.name, "\" from process directory name"), '💡');
    }
    if (!config.themeColor) {
        logger.warn('No theme color specified: defaulting to white', '❔');
        config.themeColor = 'white';
    }
    if (config.icon) {
        if ((0, path_1.extname)(config.icon) !== '.svg') {
            logger.error('Icon path must end with .svg', '❌');
            config.icon = undefined;
        }
        else if (!(0, fs_1.existsSync)(config.icon)) {
            logger.error('Icon file not found', '❌');
            config.icon = undefined;
        }
    }
    else {
        logger.error('Missing icon path', '❌');
    }
    if (!config.resources) {
        logger.error('Missing resources globs', '❌');
    }
    if (!config.resources || !config.icon) {
        process.exit(1);
    }
    return config;
}
