import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  hospitalId: number;
  hospitalName: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  patientName: string;
  amountPaid?: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Expired';
  userEmail: string;
}

const BookingSchema: Schema = new Schema(
  {
    hospitalId: { type: Number, required: true },
    hospitalName: { type: String, required: true },
    doctorId: { type: Number, required: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    patientName: { type: String, required: true },
    amountPaid: { type: Number },
    status: { type: String, default: 'Confirmed' },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
