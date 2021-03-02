import {formatShell} from './shell'
import {formatDotenv} from './dotenv'
import {formatYaml} from './yaml'
import {formatJson} from './json'

export function formatter(type: 'shell' | 'dotenv' | 'yaml' | 'json' | string) {
  if (type === 'shell') {
    return formatShell
  }
  if (type === 'dotenv') {
    return formatDotenv
  }
  if (type === 'yaml') {
    return formatYaml
  }
  if (type === 'json') {
    return formatJson
  }
  return _ => _
}
