import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const hospitalId = searchParams.get('hospitalId');
    const date = searchParams.get('date');

    if (!doctorId || !hospitalId || !date) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const bookings = await Booking.find({
      doctorId: Number(doctorId),
      hospitalId: Number(hospitalId),
      date: date,
      status: { $ne: 'Cancelled' }
    });

    const bookedSlots = bookings.map(b => b.time);

    return NextResponse.json(bookedSlots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching slots' }, { status: 500 });
  }
}
