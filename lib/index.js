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
        const output = core.getInput('output', { required: true });
        const prefix = core.getInput('prefix');
        const allParameters = [];
        const withDecryption = core.getInput('decryption') === 'true';
        let nextToken;
        try {
            do {
                const result = await ssm
                    .getParametersByPath({
                    WithDecryption: withDecryption,
                    Path: ssmPath,
                    Recursive: true,
                    NextToken: nextToken,
                })
                    .promise();
                core.debug(`parameters length: ${result.Parameters.length}`);
                nextToken = result.NextToken;
                allParameters.push(...result.Parameters);
            } while (nextToken);
            const envs = allParameters
                .map(p => ({
                Value: p.Value,
                Name: p.Name.split('/').pop(),
            }))
                .map(format_1.formatter(format)(prefix));
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
