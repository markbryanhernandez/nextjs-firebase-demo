export function debugLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(...args);
  }
}

export function errorLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args);
  }
}
