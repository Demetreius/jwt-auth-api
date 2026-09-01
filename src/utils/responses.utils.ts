import { type Response } from 'express';

// 1. Define Success Response shape
export type ApiSuccessResponse<T = any> = {
  success: true;
  message: string;
  data: T;
};

// 2. Define Error Response shape
export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

// 3. Combine them into a Discriminated Union
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper for sending success responses
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Helper for sending error responses
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: any
): Response<ApiErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
};