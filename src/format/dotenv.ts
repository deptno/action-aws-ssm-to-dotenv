export const formatDotenv = (prefix = '') =>
  ({Name, Value}) => `${Name}=${Value}`
