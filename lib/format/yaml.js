"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatYaml = (prefix = '') => ({ Name, Value }) => `${prefix}${Name}: ${Value}`;
