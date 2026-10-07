import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const routeSchema = new Schema(
  {
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      unique: true,
      trim: true,
    },
    startPoint: {
      type: String,
      required: [true, 'Start point is required'],
      trim: true,
    },
    endPoint: {
      type: String,
      required: [true, 'End point is required'],
      trim: true,
    },
    stops: {
      type: [String],
      default: [],
    },
    scheduleTimes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'route',
  }
);

export const RouteModel = mongoose.models.Route || model('Route', routeSchema);
export default RouteModel;
