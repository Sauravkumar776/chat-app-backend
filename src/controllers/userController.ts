import { Request, Response } from 'express';
import { registerUser, authenticateUser, generateAccessToken, generateRefreshToken } from '../services/authService';
import User from '../models/User';
import { JWT_KEY, REFRESH_JWT_KEY } from '../config';
import jwt from 'jsonwebtoken';

export default {
    register: async (req: any, res: Response): Promise<any> => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        try {
            const user = await registerUser(username, email, password);
            return res.status(201).send({ message: "User registered successfully", userId: user._id });
        } catch (err: any) {
            return res.status(500).send({ message: "Registration failed", error: err.message });
        }
    },

    login: async (req: any, res: Response): Promise<any> => {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        if (!user) {
            return res.status(400).send({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).send({ accessToken, refreshToken });
    },

    refreshToken: async (req: any, res: Response): Promise<any> => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).send({ message: "Refresh token required" });
        }

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_JWT_KEY) as any;
            const user = await User.findById(decoded.userId);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).send({ message: "Invalid refresh token" });
            }

            const newAccessToken = await generateAccessToken(user);
            return res.status(200).send({ accessToken: newAccessToken });
        } catch (err: any) {
            return res.status(403).send({ message: "Failed to refresh token", error: err.message });
        }
    }
}

