import Message, {IMessage} from "../models/Message";

export const sendMessage = async (roomId: string, sender: string, content:string): Promise <IMessage> => {
    const message = new Message({ roomId, sender, content})
    return await message.save()
}

export const getMessagesByRoomId = async (roomId: string, limit: number = 50): Promise<IMessage[]> => {
    return await Message.find({ roomId }).sort({ timestamp: -1 }).limit(limit);
};

export const getMessageById = async (messageId: string): Promise<IMessage | null> => {
    return await Message.findById(messageId);
};

export const deleteMessage = async (messageId: string): Promise<IMessage | null> => {
    return await Message.findByIdAndDelete(messageId);
};

export const updateMessage = async (messageId: string, newContent: string): Promise<IMessage | null> => {
    return await Message.findByIdAndUpdate(messageId, { content: newContent }, { new: true });
};
