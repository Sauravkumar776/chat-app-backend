import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
    name: string;
    participants: mongoose.Types.ObjectId[];
    type: 'private' | 'group'; // Type of the room
    lastMessage?: mongoose.Types.ObjectId; // Reference to the last message
    createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, default: Date.now } // Timestamp for room creation
});

export default mongoose.model<IRoom>('Room', RoomSchema);
