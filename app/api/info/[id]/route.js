import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/app/Lib/connect';
import Password from '@/app/model/Schema';
import { encrypt, decrypt } from '@/app/utils/crypto';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const body = await req.json();
    const encryptedPassword = encrypt(body.password);
    const updated = await Password.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { app: body.app, username: body.username, password: encryptedPassword },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Password not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updated._id.toString(),
      app: updated.app,
      username: updated.username,
      password: body.password
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const result = await Password.deleteOne({ _id: id, userId: session.user.id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Password not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
