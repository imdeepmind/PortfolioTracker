import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITransaction extends Document {
  user: Types.ObjectId;
  holding: Types.ObjectId;
  amount: number;
  totalAmountInvested: number;
  totalPortfolioSize: number;
  dateTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    holding: {
      type: Schema.Types.ObjectId,
      ref: 'Holding',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    totalAmountInvested: {
      type: Number,
      required: true,
    },
    totalPortfolioSize: {
      type: Number,
      required: [true, 'Total portfolio size is required'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time is required'],
      default: Date.now,
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ holding: 1, dateTime: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
