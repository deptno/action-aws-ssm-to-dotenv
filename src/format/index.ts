import {formatShell} from './shell'
import {formatDotenv} from './dotenv'
import {formatYaml} from './yaml'

export function formatter(type: 'shell' | 'dotenv' | 'yaml' | string) {
  if (type === 'shell') {
    return formatShell
  }
  if (type === 'dotenv') {
    return formatDotenv
  }
  if (type === 'yaml') {
    return formatYaml
  }
  return _ => _
}
