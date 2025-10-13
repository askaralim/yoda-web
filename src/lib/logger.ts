// Production logging utility
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private service: string;

  constructor(service: string = 'yoda-web') {
    this.service = service;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      metadata,
    };

    // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Send to external logging service
      console.log(JSON.stringify(entry));
    } else {
      // Development logging
      console.log(`[${level.toUpperCase()}] ${message}`, metadata);
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, metadata);
    }
  }
}

export const logger = new Logger();
