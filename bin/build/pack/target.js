"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetNames = exports.Targets = void 0;
const pwa_1 = require("./pwa");
const html_1 = require("./html");
exports.Targets = { pwa: pwa_1.pwa, html: html_1.html };
exports.TargetNames = Object.keys(exports.Targets);
