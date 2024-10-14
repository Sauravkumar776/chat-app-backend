import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_KEY, REFRESH_JWT_KEY, TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config';

export const registerUser = async (username: string, email: string, password: string): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    return user;
};

export const authenticateUser = async (email: string, password: string): Promise<IUser | null> => {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) return user;
    return null;
};

export const generateToken = (payload: any, expiry: string, key: string): string => {
    return jwt.sign(payload, key, { expiresIn: expiry });
};

export const generateAccessToken = (user: IUser): string => {
    return generateToken({ userId: user._id }, TOKEN_EXPIRY, JWT_KEY);
};

export const generateRefreshToken = (user: IUser): string => {
    return generateToken({ userId: user._id }, REFRESH_TOKEN_EXPIRY, REFRESH_JWT_KEY);
};
