import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHolding extends Document {
  name: string;
  description: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HoldingSchema: Schema<IHolding> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Holding name is required"],
      trim: true,
      maxlength: [100, "Name must be at most 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Holding: Model<IHolding> =
  mongoose.models.Holding || mongoose.model<IHolding>("Holding", HoldingSchema);

export default Holding;
