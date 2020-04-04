import * as core from '@actions/core'
import * as AWS from 'aws-sdk'
import { formatter } from './format'
import { appendFileSync, existsSync, writeFileSync } from 'fs'
import { GetParametersByPathResult, Parameter } from 'aws-sdk/clients/ssm'

async function run() {
  const region = process.env.AWS_DEFAULT_REGION
  const ssm = new AWS.SSM({ region })

  try {
    const ssmPath = core.getInput('ssm-path', { required: true })
    const format = core.getInput('format', { required: true })
    const output = core.getInput('output', { required: false })
    const setAsEnv = core.getInput('set-as-env', { required: false })
    const setCase = core.getInput('set-case', { required: false })
    const prefixPaths = core.getInput('prefix-paths', { required: false })
    const prefix = core.getInput('prefix', { required: false })
    const allParameters: Parameter[] = []
    const withDecryption = core.getInput('decryption', { required: false }) === 'true'
    let nextToken: string
    const ssmPathPrefixed = (ssmPath[0] == '/' ? ssmPath : '/' + ssmPath)

    try {


      do {
        const result: GetParametersByPathResult = await ssm
          .getParametersByPath({
            WithDecryption: withDecryption,
            Path: ssmPathPrefixed,
            Recursive: true,
            NextToken: nextToken,
          })
          .promise()

        core.debug(`parameters length: ${result.Parameters.length}`)
        nextToken = result.NextToken
        allParameters.push(...result.Parameters)
      } while (nextToken)

      function splitPaths(s, keepPrefix, addPrefix = '') {
        if (keepPrefix != 'false') {
          let r = s.replace(ssmPathPrefixed, '')
          return addPrefix.toString() + r.replace('/', '_')
        } else {
          return addPrefix.toString() + s.split('/').pop()
        }
      }
      function transformWord(s, transform) {
        switch (transform) {
          case "upper":
            return s.toUpperCase()
          case "lower":
            return s.toLowerCase()
          default:
            return s
        }
      }

      function createJobENV(createEnv: string, Name: string, Value: string) {
        if (createEnv != 'false') {
          core.setOutput(Name, Value)
          core.exportVariable(Name, Value)
        }
        return Name
      }

      const envs = allParameters
        .map<Parameter>(p => ({
          Value: p.Value,
          Name: createJobENV(setAsEnv, transformWord(splitPaths(p.Name, prefixPaths, prefix), setCase), p.Value),
        }))
        .map<string>(formatter(format))

      if (envs.length > 0) {
        envs.push('\n')
      }

      if (existsSync(output)) {
        console.log(`append to ${output} file`)
        appendFileSync(output, '\n' + envs.join('\n'))
      } else {
        console.log(`create ${output} file`)
        writeFileSync(output, envs.join('\n'))
      }
    } catch (e) {
      core.error(e)
      core.setFailed(e.message)
    }
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
