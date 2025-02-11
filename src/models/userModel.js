import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    required: true,
    type: String,
  },
  userName: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  email: {
    required: true,
    type: String,
  },
  dob: {
    type: Date,
    default: null,
  },
});

export const User =
  mongoose.models.users ?? mongoose.model("users", userSchema);
