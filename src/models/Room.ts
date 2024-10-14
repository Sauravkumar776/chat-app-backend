import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
    name: string;
    participants: string[];
}

const RoomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model<IRoom>('Room', RoomSchema);