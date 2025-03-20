// ✅ Create socket Server
// ✅ Store messages in MongoDB.
// ✅ Handle live typing events.
// ✅ Manage offline message delivery.
// ✅ Implement seen/unseen indicators.

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { saveMessageAndUpdateConversation } from "./src/controllers/messageController.js";
import Message from "./src/models/chat/messageModel.js";
const dev = process.env.NODE_ENV !== "production";
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

  io.on("connection", (socket) => {
    //console.log("✅ User connected:", socket.id);

    socket.on("userConnected", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // Handle message sending
    socket.on("sendMessage", async (messageData, callback) => {
      try {
        const savedMessage = await saveMessageAndUpdateConversation(
          messageData
        );

        // Emit message to recipient if online
        if (onlineUsers.has(messageData.receiver)) {
          io.to(onlineUsers.get(messageData.receiver)).emit(
            "receiveMessage",
            savedMessage
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
        // ✅ Get the updated message after setting seen: true
        const message = await Message.findByIdAndUpdate(
          messageId,
          { seen: true },
          { new: true } // ✅ Ensures updated data is returned
        );

        // Emit a seen status update back to the sender
        if (onlineUsers.has(receiverId)) {
          io.to(onlineUsers.get(receiverId)).emit("messageSeen", message);
        }
      } catch (error) {
        console.error("❌ Error marking message as seen:", error);
      }
    });

    socket.on("markAsSeenBulk", async ({ messageIds, senderId }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds } },
          { $set: { seen: true } }
        );

        // ✅ Broadcast "messageSeen" to the sender in real time
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
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) onlineUsers.delete(userId);
      });
      //console.log("❌ User disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
