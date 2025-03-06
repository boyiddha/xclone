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
  image: {
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

export const User =
  mongoose?.models?.users ?? mongoose.model("users", userSchema);
