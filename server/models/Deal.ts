import mongoose, { Schema, Document } from 'mongoose';

export interface IDecayPoint {
  hoursRemaining: number;
  discountPercent: number;
  pricePkr: number;
}

export interface IDeal extends Document {
  itemRef: mongoose.Types.ObjectId;
  retailerRef: mongoose.Types.ObjectId;
  currentDiscountedPricePkr: number;
  discountPercent: number;
  decaySchedule: IDecayPoint[];
  status: 'active' | 'sold' | 'expired';
  manualOverridePricePkr?: number;
  stockQuantity: number;
  pickupWindowText: string;
}

const DealSchema: Schema = new Schema(
  {
    itemRef: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    retailerRef: { type: Schema.Types.ObjectId, ref: 'Retailer', required: true },
    currentDiscountedPricePkr: { type: Number, required: true },
    discountPercent: { type: Number, required: true },
    decaySchedule: [
      {
        hoursRemaining: { type: Number },
        discountPercent: { type: Number },
        pricePkr: { type: Number },
      },
    ],
    status: { type: String, enum: ['active', 'sold', 'expired'], default: 'active' },
    manualOverridePricePkr: { type: Number },
    stockQuantity: { type: Number, required: true, default: 1 },
    pickupWindowText: { type: String, default: 'Pick up before 9:00 PM' },
  },
  { timestamps: true }
);

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
