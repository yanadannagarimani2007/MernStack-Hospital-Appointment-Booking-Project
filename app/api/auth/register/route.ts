import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, mobile } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = new User({
      name,
      email,
      password, // In a real app, hash this!
      mobile,
      role: email === 'admin@gmail.com' ? 'admin' : 'user',
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully', user: { name: newUser.name, email: newUser.email, mobile: newUser.mobile, role: newUser.role } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
