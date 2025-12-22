/**
 * Debug Mode Configuration
 *
 * When DEBUG_MODE is enabled (true), the app will use sample/mock data instead of real server data.
 * This is useful for development and testing without requiring a database connection.
 *
 * Set NEXT_PUBLIC_DEBUG_MODE=true in your .env.local to enable debug mode.
 * Set NEXT_PUBLIC_DEBUG_MODE=false (or omit it) for production with real data.
 */

export const isDebugMode = (): boolean => {
  const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE;
  return debugMode === 'true';
};

/**
 * Helper to log debug information only in debug mode
 */
export const debugLog = (message: string, ...args: unknown[]): void => {
  if (isDebugMode()) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};
