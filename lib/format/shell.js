"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatShell = (prefix = '') => ({ Name, Value }) => `export ${prefix}${Name}="${Value}"`;
