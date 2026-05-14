// Structured JSON logger to replace common console.log
export const Logger = {
  info: (message: string, data?: any) => {
    console.info(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, data }));
  },
  warn: (message: string, data?: any) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, data }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({ level: 'ERROR', timestamp: new Date().toISOString(), message, error }));
  },
};
