// frontend/src/utils/errorHandling.ts

import { AxiosError } from 'axios';
import React, { useState } from 'react';

interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: ValidationError[];
  code?: string;
}

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  // Handle Axios errors
  const axiosError = error as AxiosError<ApiErrorResponse>;
  if (axiosError.response?.data) {
    const { data } = axiosError.response;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors?.[0]) return data.errors[0].message;
  }

  // Handle unknown errors
  return 'An unexpected error occurred';
};

/**
 * Get field-specific validation errors
 */
export const getFieldError = (error: unknown, field: string): string | undefined => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  if (axiosError.response?.data?.errors) {
    const fieldError = axiosError.response.data.errors.find(
      (e) => e.field === field
    );
    return fieldError?.message;
  }
  return undefined;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 401;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 422;
};

/**
 * Create a formatted error object
 */
export const createApiError = (message: string, field?: string, code?: string): ApiError => ({
  message,
  field,
  code
});

/**
 * Handle async operation with error handling
 */
export const handleAsync = async <T>(
  operation: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
    return null;
  }
};

/**
 * Custom hook for handling loading and error states
 */
export const useAsyncOperation = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (operation: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      setData(result);
      return result;
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, execute };
};

/**
 * Format error for display
 */
export const formatErrorForDisplay = (error: unknown): string => {
  const message = getErrorMessage(error);
  // Capitalize first letter and ensure it ends with a period
  return message.charAt(0).toUpperCase() + message.slice(1) +
    (message.endsWith('.') ? '' : '.');
};

/**
 * Error boundary component
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}