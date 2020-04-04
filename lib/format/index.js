"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("./shell");
const dotenv_1 = require("./dotenv");
const yaml_1 = require("./yaml");
const json_1 = require("./json");
function formatter(type) {
    if (type === 'shell') {
        return shell_1.formatShell;
    }
    if (type === 'dotenv') {
        return dotenv_1.formatDotenv;
    }
    if (type === 'yaml') {
        return yaml_1.formatYaml;
    }
    if (type === 'json') {
        return json_1.formatJson;
    }
    return _ => _;
}
exports.formatter = formatter;
