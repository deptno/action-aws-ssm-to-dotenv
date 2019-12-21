import * as core from '@actions/core'
import * as AWS from 'aws-sdk'
import {formatter} from './format'
import {writeFileSync} from 'fs'
import {GetParametersByPathResult, Parameter} from 'aws-sdk/clients/ssm'

async function run() {
  const region = process.env.AWS_DEFAULT_REGION
  const ssm = new AWS.SSM({region})

  try {
    const ssmPath = core.getInput('ssm-path', {required: true})
    const format = core.getInput('format', {required: true})
    const output = core.getInput('output', {required: true})
    const prefix = core.getInput('prefix')
    const allParameters: Parameter[] = []
    const withDecryption = core.getInput('decryption') === 'true'
    let nextToken: string

    try {
      do {
        const result: GetParametersByPathResult = await ssm
          .getParametersByPath({
            WithDecryption: withDecryption,
            Path          : ssmPath,
            Recursive     : true,
            NextToken     : nextToken,
          })
          .promise()

        core.debug(`parameters length: ${result.Parameters.length}`)
        nextToken = result.NextToken
        allParameters.push(...result.Parameters)
      } while (nextToken)


      const envs = allParameters
        .map<Parameter>(p => ({
          Value: p.Value,
          Name : p.Name.split('/').pop(),
        }))
        .map<string>(formatter(format)(prefix))
      if (envs.length > 0) {
        envs.push('\n')
      }

      writeFileSync(output, envs.join('\n'))
    } catch (e) {
      core.error(e)
      core.setFailed(e.message)
    }
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
