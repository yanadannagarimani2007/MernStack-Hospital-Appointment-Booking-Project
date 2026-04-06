import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map(u => {
      const uObj = u.toObject();
      return { ...uObj, id: uObj._id.toString() };
    });

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching users' }, { status: 500 });
  }
}
