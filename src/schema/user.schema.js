import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'driver', 'transportation-manager'],
      default: 'user',
    },
    banned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: null,
    },
    banExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

export const User = mongoose.models.User || model('User', userSchema);
export default User;
