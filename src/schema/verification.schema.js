import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const verificationSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'verification',
  }
);

export const Verification = mongoose.models.Verification || model('Verification', verificationSchema);
export default Verification;
