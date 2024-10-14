import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    messageId: mongoose.Types.ObjectId; // Reference to the message that triggered the notification
    type: 'message' | 'mention'; // Type of notification
    isRead: boolean; // Read status
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    type: { type: String, enum: ['message', 'mention'], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
