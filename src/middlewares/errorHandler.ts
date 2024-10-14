import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';

interface ErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    stack?: string; // Include stack trace in development only
}

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
) => {
    // Default values
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error (in production, use a logger)
    console.error(err);

    // Respond with the error
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;