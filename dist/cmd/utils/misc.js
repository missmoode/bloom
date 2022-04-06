"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unicodeLength = void 0;
function unicodeLength(str) {
    if (str.length == 0)
        return 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return str.match(/./gu).length;
}
exports.unicodeLength = unicodeLength;
