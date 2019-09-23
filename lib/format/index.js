"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("./shell");
const dotenv_1 = require("./dotenv");
function formatter(type) {
    if (type === 'shell') {
        return shell_1.formatShell;
    }
    if (type === 'dotenv') {
        return dotenv_1.formatDotenv;
    }
    return _ => _;
}
exports.formatter = formatter;
