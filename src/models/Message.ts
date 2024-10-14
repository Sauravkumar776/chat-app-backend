import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    roomId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

export default mongoose.model<IMessage>('Message', MessageSchema)