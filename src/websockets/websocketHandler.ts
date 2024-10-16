// websocketHandler.ts
import { Server } from 'ws';
import { Server as HttpServer } from 'http';
import Room from '../models/Room';
import Message from '../models/Message';
import Notification from '../models/Notification';
import { createRoom } from '../services/roomService';
import User from '../models/User';
import mongoose from 'mongoose';

interface Client extends WebSocket {
    userId: string; // User ID
    roomId?: string; // Room ID the user is currently in
}

const userConnections = new Map<string, Set<Client>>(); 

const initializeWebSocketServer = (httpServer: HttpServer) => {
    const wss = new Server({ server: httpServer });

    console.log('this is wss', wss)

    wss.on('connection', (ws: any) => {
        console.log('New client connected');

        ws.on('message', async (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                const data = JSON.parse(message);
                const { action, roomId, content, senderId, type } = parsedMessage;

                switch (action) {

                    case 'createRoom':
                        const room = await createRoom(data.name, data.participants, data.type);
                        ws.send(JSON.stringify({ type: 'roomCreated', room }));
                        break;

                    case 'joinRoom':
                        ws.roomId = roomId;
                        ws.userId = senderId;

                        if (!userConnections.has(senderId)) {
                            userConnections.set(senderId, new Set());
                        }
                        userConnections.get(senderId)?.add(ws);

                        console.log(`User ${senderId} joined room ${roomId}`);
                        break;

                    case 'sendMessage':
                        if (!ws.roomId) {
                            console.error('User not in a room');
                            return;
                        }

                        // Save the message to the database
                        const newMessage = new Message({
                            roomId: ws.roomId,
                            sender: ws.userId,
                            content,
                            type
                        });
                        await newMessage.save();

                        // Broadcast to all users in the room
                        broadcastToRoom(ws.roomId, {
                            action: 'receiveMessage',
                            roomId: ws.roomId,
                            content,
                            senderId: ws.userId,
                            timestamp: newMessage.timestamp,
                            status: newMessage.status,
                            type: newMessage.type
                        });

                        // Notify other participants in the room
                        await Room.findById(ws.roomId).populate('participants').then(async (room) => {
                            if (room) {
                                const notifications = room.participants
                                    .filter((participant) => !participant.equals(ws.userId))
                                    .map((participant) => ({
                                        userId: participant,
                                        messageId: newMessage._id,
                                        type: 'message',
                                    }));
                                await Notification.insertMany(notifications);
                            }
                        });
                        break;

                    default:
                        console.error(`Unknown action: ${action}`);
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            if (ws.userId) {
                const userSockets = userConnections.get(ws.userId);
                if (userSockets) {
                    userSockets.delete(ws);
                    if (userSockets.size === 0) {
                        userConnections.delete(ws.userId);
                    }
                }
            }
            console.log('Client disconnected');
        });
    });
    
    wss.on('error', (error) => {
        console.log(error)
    })

    console.log('WebSocket server started');
};

const broadcastToRoom = (roomId: string, message: object) => {
    for (const [userId, sockets] of userConnections) {
        for (const socket of sockets) {
            if (socket.roomId === roomId) {
                socket.send(JSON.stringify(message));
            }
        }
    }
};

export default initializeWebSocketServer;
