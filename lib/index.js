"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const AWS = require("aws-sdk");
const format_1 = require("./format");
const fs_1 = require("fs");
async function run() {
    const region = process.env.AWS_DEFAULT_REGION;
    const ssm = new AWS.SSM({ region });
    try {
        const ssmPath = core.getInput('ssm-path', { required: true });
        const format = core.getInput('format', { required: true });
        const output = core.getInput('output', { required: false });
        const setAsEnv = core.getInput('set-as-env', { required: false });
        const setCase = core.getInput('set-case', { required: false });
        const prefixPaths = core.getInput('prefix-paths', { required: false });
        const prefix = core.getInput('prefix', { required: false });
        const allParameters = [];
        const withDecryption = core.getInput('decryption', { required: false }) === 'true';
        let nextToken;
        const ssmPathPrefixed = (ssmPath[0] == '/' ? ssmPath : '/' + ssmPath);
        try {
            do {
                const result = await ssm
                    .getParametersByPath({
                    WithDecryption: withDecryption,
                    Path: ssmPathPrefixed,
                    Recursive: true,
                    NextToken: nextToken,
                })
                    .promise();
                core.debug(`parameters length: ${result.Parameters.length}`);
                nextToken = result.NextToken;
                allParameters.push(...result.Parameters);
            } while (nextToken);
            function splitPaths(s, keepPrefix, addPrefix = '') {
                if (keepPrefix != 'false') {
                    let r = addPrefix.toString() + s.replace(ssmPathPrefixed, '');
                    return r.split('/').join('_');
                }
                else {
                    return addPrefix.toString() + s.split('/').pop();
                }
            }
            function transformWord(s, transform) {
                switch (transform) {
                    case "upper":
                        return s.toUpperCase();
                    case "lower":
                        return s.toLowerCase();
                    default:
                        return s;
                }
            }
            function createJobENV(createEnv, Name, Value) {
                if (createEnv != 'false') {
                    core.setOutput(Name, Value);
                    core.exportVariable(Name, Value);
                }
                const regex = RegExp('[a-zA-Z_]+[a-zA-Z0-9_]*');
                if (regex.test(Name)) {
                    core.warning(`The Key name ${Name} doesn't comply with shell variable names: [a-zA-Z_]+[a-zA-Z0-9_]*`);
                }
                return Name;
            }
            const envs = allParameters
                .map(p => ({
                Value: p.Value,
                Name: createJobENV(setAsEnv, transformWord(splitPaths(p.Name, prefixPaths, prefix), setCase), p.Value),
            }))
                .map(format_1.formatter(format));
            if (envs.length > 0) {
                envs.push('\n');
            }
            if (fs_1.existsSync(output)) {
                console.log(`append to ${output} file`);
                fs_1.appendFileSync(output, '\n' + envs.join('\n'));
            }
            else {
                console.log(`create ${output} file`);
                fs_1.writeFileSync(output, envs.join('\n'));
            }
        }
        catch (e) {
            core.error(e);
            core.setFailed(e.message);
        }
    }
    catch (e) {
        core.setFailed(e.message);
    }
}
run();
