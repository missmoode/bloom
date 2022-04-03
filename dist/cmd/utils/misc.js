"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pad = exports.unicodeLength = void 0;
function unicodeLength(str) {
    if (str.length == 0)
        return 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return str.match(/./gu).length;
}
exports.unicodeLength = unicodeLength;
function pad(str, length, padRight) {
    if (str === void 0) { str = ''; }
    if (padRight === void 0) { padRight = false; }
    if (unicodeLength(str) > length) {
        return "..".concat(str.slice(-length + 2));
    }
    else {
        return "".concat(!padRight ? str : '').concat(' '.repeat(length - unicodeLength(str))).concat(padRight ? str : '');
    }
}
exports.pad = pad;
