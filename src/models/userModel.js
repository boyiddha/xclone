import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    required: true,
    type: String, // use trim:true for string field
    trim: true, // This ensures no extra spaces are stored in db
  },
  userName: {
    type: String,
    default: null,
    trim: true,
  },
  password: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  email: {
    required: true,
    type: String,
    unique: true, // ✅ Prevent duplicate emails
  },
  dob: {
    type: Date,
    default: null,
  },
  forgetPasswordCode: {
    type: String,
    default: null,
  },
  forgetPasswordExpiresAt: {
    type: Date,
    default: null,
  },
});

// Pre-save hook to check expiration; it delete this field data automatically after expires
userSchema.pre("save", function (next) {
  if (
    this.forgetPasswordExpiresAt &&
    new Date() > this.forgetPasswordExpiresAt
  ) {
    this.forgetPasswordCode = null;
    this.forgetPasswordExpiresAt = null;
  }
  next();
});

// define the model as "User" while pointing to the "users" collection,
export const User =
  mongoose?.models?.User ?? mongoose.model("User", userSchema, "users");
