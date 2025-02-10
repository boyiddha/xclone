import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_CONNECTION_STR;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // If already connected, do nothing
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB......................");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
