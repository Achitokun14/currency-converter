import mongoose from 'mongoose';

export interface IConversion {
  user: mongoose.Types.ObjectId;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
  rate: number;
  date: Date;
}

const conversionSchema = new mongoose.Schema<IConversion>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromCurrency: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3
  },
  toCurrency: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  result: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const Conversion = mongoose.model<IConversion>('Conversion', conversionSchema);