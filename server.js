// ✅ Create socket Server
// ✅ Store messages in MongoDB.
// ✅ Handle live typing events.
// ✅ Manage offline message delivery.
// ✅ Implement seen/unseen indicators.

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  saveMessageAndUpdateConversation,
  markMessageAsSeenService,
  markMessagesAsSeenBulkService,
} from "./src/services/messageService.js";
import Message from "./src/models/chat/messageModel.js";
const dev = process.env.NODE_ENV?.trim().toLowerCase() !== "production";

const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:3000", credentials: true },
  });

  let onlineUsers = new Map(); // Store online users (userId -> cocket.id)
  let offlineUsers = new Map();
  io.on("connection", (socket) => {
    // Track user as online only from conversation component
    socket.on("userConnected", (userId, fromConversation = false) => {
      if (fromConversation) {
        onlineUsers.set(userId, socket.id);
        //console.log("✅  online user....... connected ", userId);
      } else {
        offlineUsers.set(userId, socket.id);
        //console.log(" ✅  offline user connected: ", userId);
      }
    });

    // Handle message sending
    socket.on("sendMessage", async (messageData, callback) => {
      try {
        const savedMessage = await saveMessageAndUpdateConversation(
          messageData
        );

        // Emit message to recipient ui if the receiver at online means currently he at conversation ui
        if (onlineUsers.has(messageData.receiver)) {
          io.to(onlineUsers.get(messageData.receiver)).emit(
            "receiveMessage",
            savedMessage
          );
        } else {
          // if the receiver not in online then send new message notification into navbar ui
          io.to(offlineUsers.get(messageData.receiver)).emit(
            "newMessageNotification",
            {
              senderId: messageData.sender,
              message: savedMessage.content,
            }
          );
        }

        // ✅ Send the saved message back to the sender and dispaly in UI
        callback(savedMessage);
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    // Typing indicator
    socket.on("userTyping", ({ sender, receiver }) => {
      if (onlineUsers.has(receiver)) {
        io.to(onlineUsers.get(receiver)).emit("typing", { sender });
      }
    });

    // Mark message as seen
    socket.on("markAsSeen", async ({ messageId, receiverId }) => {
      try {
        const message = await markMessageAsSeenService(messageId);
        if (onlineUsers.has(receiverId)) {
          //  Emit a seen status update back to the sender
          io.to(onlineUsers.get(receiverId)).emit("messageSeen", message);
        }
      } catch (error) {
        console.error("❌ Error marking message as seen:", error);
      }
    });

    socket.on("markAsSeenBulk", async ({ messageIds, senderId }) => {
      try {
        await markMessagesAsSeenBulkService(messageIds);
        if (onlineUsers.has(senderId)) {
          io.to(onlineUsers.get(senderId)).emit("messageSeenBulk", {
            messageIds,
          });
        }
      } catch (error) {
        console.error("❌ Error marking messages as seen:", error);
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          //console.log(`❌ online User ${userId} disconnected`);
          onlineUsers.delete(userId); // Remove user from online users
          break;
        }
      }
      for (let [userId, socketId] of offlineUsers.entries()) {
        if (socketId === socket.id) {
          //console.log(`❌ Offline user ${userId} disconnected`);
          offlineUsers.delete(userId); // Remove user from offline users
          break;
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
