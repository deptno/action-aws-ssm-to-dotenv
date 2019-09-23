"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDotenv = (prefix = '') => ({ Name, Value }) => `${Name}=${Value}`;
