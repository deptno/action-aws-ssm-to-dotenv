import {formatShell} from './shell'
import {formatDotenv} from './dotenv'

export function formatter(type: 'shell' | 'dotenv' | string) {
  if (type === 'shell') {
    return formatShell
  }
  if (type === 'dotenv') {
    return formatDotenv
  }
  return _ => _
}
