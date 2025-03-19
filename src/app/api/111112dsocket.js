import { Server } from "socket.io";
import { saveMessage } from "@/controllers/messageController";

const SocketHandler = (req, res) => {
  // Ensure that the socket server is initialized only once
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" }, // Allow all origins for simplicity, adjust as needed
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle sending a message
      socket.on("sendMessage", async ({ sender, receiver, content }) => {
        try {
          const savedMessage = await saveMessage({ sender, receiver, content });

          // Emit message to the receiver
          io.to(receiver).emit("receiveMessage", savedMessage);
        } catch (err) {
          console.error("Error saving message:", err);
        }
      });

      // Handle disconnect event
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Save the io server instance for future use
    res.socket.server.io = io;
  }

  // Send a response back to indicate the API route has been processed
  res.end();
};

export default SocketHandler;
