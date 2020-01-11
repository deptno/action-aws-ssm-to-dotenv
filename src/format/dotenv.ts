export const formatDotenv = (prefix = '') =>
  ({Name, Value}) => `${prefix}${Name}=${Value}`
