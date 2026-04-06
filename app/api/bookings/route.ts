import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    let bookings;
    if (role === 'admin') {
      bookings = await Booking.find({}).sort({ createdAt: -1 });
    } else if (email) {
      bookings = await Booking.find({ userEmail: email }).sort({ createdAt: -1 });
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Convert MongoDB _id to id to match existing frontend code structure
    const formattedBookings = bookings.map(b => {
      const bObj = b.toObject();
      return { ...bObj, id: bObj._id.toString() };
    });

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching bookings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const bookingData = await req.json();

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      hospitalId: bookingData.hospitalId,
      doctorId: bookingData.doctorId,
      date: bookingData.date,
      time: bookingData.time,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'This slot is already booked.' }, { status: 400 });
    }

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    const savedObj = newBooking.toObject();
    return NextResponse.json({ ...savedObj, id: savedObj._id.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating booking' }, { status: 500 });
  }
}
