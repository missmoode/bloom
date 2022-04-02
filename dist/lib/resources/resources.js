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
exports.Resources = exports.resourceful = void 0;
var loaders_1 = require("@pixi/loaders");
var shaderloaderplugin_1 = require("./shaderloaderplugin");
/**
 * @param base The object to attach resources to
 * @param resources The resources the view requires
 * @returns The view constructor packed with the resource keys for later loading
 */
function resourceful(base, resources) {
    return __assign(__assign({}, base), { _resources: resources });
}
exports.resourceful = resourceful;
var Resources = /** @class */ (function () {
    function Resources() {
    }
    /**
     * @param base The object to attach resources to
     * @param resources The resources the view requires
     * @returns The view constructor packed with the resource keys for later loading
     */
    Resources.attach = function (base, resources) {
        return __assign(__assign({}, base), { _resources: resources });
    };
    Resources.loaded = function (resourcefulObject) {
        for (var key in resourcefulObject._resources) {
            var r = this.reservations[key];
            if (!r)
                return false;
            if (!r.resource.isComplete)
                return false;
        }
        return true;
    };
    Resources.load = function (resourcefulObject) {
        for (var key in this.reservations) {
        }
        resourcefulObject._resources;
    };
    Resources.reservations = {};
    (function () {
        loaders_1.Loader.registerPlugin(new shaderloaderplugin_1.ShaderLoaderPlugin());
    })();
    return Resources;
}());
exports.Resources = Resources;
