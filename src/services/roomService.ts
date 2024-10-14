import Room, {IRoom} from "../models/Room";

export const createRoom = async (name: string, participants: string[], type: 'private' | 'group'): Promise<IRoom> => {
    const room = new Room({ name, participants, type})
    return await room.save();
}

export const getRoomById = async (roomId: string): Promise<IRoom | null> => {
    return await Room.findById(roomId).populate('participants', 'username email'); // populate participants with their details
};

export const getAllRooms = async (userId: string): Promise<IRoom[]> => {
    return await Room.find({ participants: userId });
};

export const addParticipants = async (roomId: string, userIds: string[]): Promise<IRoom | null> => {
    return await Room.findByIdAndUpdate(
        roomId,
        { $addToSet: { participants: { $each: userIds } } }, // Add only unique user IDs
        { new: true }
    );
};

export const removeParticipant = async (roomId: string, userId: string): Promise<IRoom | null> => {
    return await Room.findByIdAndUpdate(
        roomId,
        { $pull: { participants: userId } }, // Remove user ID
        { new: true }
    );
};

export const deleteRoom = async (roomId: string): Promise<IRoom | null> => {
    return await Room.findByIdAndDelete(roomId);
};
