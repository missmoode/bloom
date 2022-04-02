"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderLoaderPlugin = void 0;
var core_1 = require("@pixi/core");
var loaders_1 = require("@pixi/loaders");
var fileExtension = 'glsl';
var ShaderLoaderPlugin = /** @class */ (function () {
    function ShaderLoaderPlugin() {
    }
    ShaderLoaderPlugin.prototype.add = function () {
        // shader files loaded as text
        loaders_1.LoaderResource.setExtensionXhrType(fileExtension, loaders_1.LoaderResource.XHR_RESPONSE_TYPE.TEXT);
    };
    ShaderLoaderPlugin.prototype.use = function (resource, next) {
        if (resource.extension !== fileExtension) {
            return next();
        }
        var text = resource.data;
        var vertFinder = /(?<=\/\/ VERTEX SHADER\n)(?:.|\n)*?(?=(?:\/\/ FRAGMENT SHADER\n)|$)/;
        var fragFinder = /(?<=\/\/ FRAGMENT SHADER\n)(?:.|\n)*?(?=(?:\/\/ VERTEX SHADER\n)|$)/;
        var vertexShader = vertFinder.exec(text);
        var fragmentShader = fragFinder.exec(text);
        var filter = new core_1.Filter(vertexShader != null ? vertexShader[0] : undefined, fragmentShader != null ? fragmentShader[0] : undefined);
        resource.data = filter;
        next();
    };
    return ShaderLoaderPlugin;
}());
exports.ShaderLoaderPlugin = ShaderLoaderPlugin;
