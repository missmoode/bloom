"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function slice(table, position) {
    return Object.assign(table.map(chain => position < chain.length ? chain[position] : undefined), { position });
}
