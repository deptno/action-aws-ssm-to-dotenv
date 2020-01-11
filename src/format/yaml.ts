export const formatYaml = (prefix = '') =>
  ({Name, Value}) => `${prefix}${Name}: ${Value}`
