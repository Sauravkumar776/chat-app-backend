import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config'
import User from '../models/User';

interface JwtPayload {
    userId: string;
}

export const authMiddleware = async (req: any, res: any, next: NextFunction) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res
            .status(401)
            .send({ code: 0, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send({ message: "Invalid or expired token." });
    }

}

