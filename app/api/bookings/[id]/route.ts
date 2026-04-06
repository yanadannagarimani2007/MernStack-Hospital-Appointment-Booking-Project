import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    // Resolve params which is returning a Promise in modern Next.js App Router
    const resolvedParams = await params;
    const body = await req.json();

    const updatedBooking = await Booking.findByIdAndUpdate(
      resolvedParams.id,
      { $set: body },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bObj = updatedBooking.toObject();
    return NextResponse.json({ ...bObj, id: bObj._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating booking' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;

    const deletedBooking = await Booking.findByIdAndDelete(resolvedParams.id);

    if (!deletedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting booking' }, { status: 500 });
  }
}
