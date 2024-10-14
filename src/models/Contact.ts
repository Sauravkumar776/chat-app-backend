import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
    userId: mongoose.Types.ObjectId;
    contactId: mongoose.Types.ObjectId; // Reference to the user contact
}

const ContactSchema = new Schema<IContact>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IContact>('Contact', ContactSchema);
