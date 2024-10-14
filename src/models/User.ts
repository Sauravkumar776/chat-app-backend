import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    refreshToken?: string;
    profilePicture?: string;
    status?: string; // e.g., "online", "offline", "busy"
    roles: string[]; // e.g., ["user", "admin"]
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    profilePicture: { type: String }, // URL to the user's profile picture
    status: { type: String, default: 'offline' }, // Default status
    roles: { type: [String], default: ['user'] }, // Default role
    createdAt: { type: Date, default: Date.now } // Timestamp for user creation
});

// Add methods for password handling
UserSchema.pre<IUser>('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default mongoose.model<IUser>('User', UserSchema);
