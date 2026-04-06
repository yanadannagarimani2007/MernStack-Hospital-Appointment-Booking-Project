import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      // In old code, admin was hardcoded in localstorage login
      if (email === 'admin@gmail.com' && password === 'admin098') {
        return NextResponse.json({ message: 'Admin login', user: { email, name: 'Admin', role: 'admin' } });
      }
      return NextResponse.json({ error: 'User not registered' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Valid login', user: { name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
