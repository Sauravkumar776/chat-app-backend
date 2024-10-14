import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    roomId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read'; 
    type: 'text' | 'image' | 'video'; 
}

const MessageSchema = new Schema<IMessage>({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' } 
});

export default mongoose.model<IMessage>('Message', MessageSchema);
