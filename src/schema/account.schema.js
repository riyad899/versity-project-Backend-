import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'account',
  }
);

export const Account = mongoose.models.Account || model('Account', accountSchema);
export default Account;
