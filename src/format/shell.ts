export const formatShell = (prefix = '') =>
  ({Name, Value}) => `export ${prefix}${Name}=${Value}`
