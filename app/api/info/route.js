import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/app/Lib/connect';
import Password from '@/app/model/Schema';
import { encrypt,decrypt } from '@/app/utils/crypto';
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
   
    await connectDB();

    const body = await req.json();
    const { app, username, password } = body;
    const encryptedPassword = encrypt(password);

    const newPassword = await Password.create({
      app,
      username,
      password: encryptedPassword,
      userId: session.user.id, 
    });

    return NextResponse.json({
      success: true,
      password: {
        id: newPassword._id.toString(),
        app,
        username,
        password,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    const passwords = await Password.find({ userId: session.user.id });

    const serialized = passwords.map((p) => ({
      id: p._id.toString(),
      app: p.app,
      username: p.username,
      password: decrypt(p.password),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
