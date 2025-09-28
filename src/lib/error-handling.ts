/**
 * Error handling utilities for better error management and logging
 */

export interface ErrorDetails {
  message: string;
  stack?: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
}

/**
 * Enhanced error class with additional context
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Safely extract error information from unknown error types
 */
export function extractErrorDetails(error: unknown): ErrorDetails {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode,
      timestamp
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      timestamp
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      timestamp
    };
  }

  if (error && typeof error === 'object') {
    const errorObj = error as any;
    return {
      message: errorObj.message || 'Unknown error',
      stack: errorObj.stack,
      code: errorObj.code,
      statusCode: errorObj.statusCode,
      timestamp
    };
  }

  return {
    message: 'Unknown error occurred',
    timestamp
  };
}

/**
 * Create standardized error response for API endpoints
 */
export function createErrorResponse(error: unknown, defaultStatus: number = 500): Response {
  const errorDetails = extractErrorDetails(error);
  const statusCode = errorDetails.statusCode || defaultStatus;

  const response = {
    error: true,
    message: errorDetails.message,
    code: errorDetails.code,
    timestamp: errorDetails.timestamp,
    ...(process.env.NODE_ENV === 'development' && { stack: errorDetails.stack })
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorDetails = extractErrorDetails(error);
      console.error('Async function error:', errorDetails);
      throw error;
    }
  };
}

/**
 * Promise timeout utility
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new AppError(errorMessage, 408, 'TIMEOUT')), timeoutMs)
    )
  ]);
}

/**
 * Retry utility for failed operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break; // Don't retry on last attempt
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt);
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, extractErrorDetails(error));

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Global unhandled promise rejection handler
 */
export function setupGlobalErrorHandlers(): void {
  process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
    console.error('Unhandled Promise Rejection:', extractErrorDetails(reason));
    console.error('Promise:', promise);

    // Don't terminate the process in production, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', extractErrorDetails(error));

    // Terminate gracefully
    process.exit(1);
  });
}