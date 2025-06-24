import { NextResponse } from "next/server";
import Auth from "@/app/model/userSchema";
import { connectDB } from "@/app/Lib/connect";

export async function POST(req) {
    try{
        await connectDB();
        const {email,code} = await req.json();
           const user = await Auth.findOne({ email });
           
    const now = Date.now();

    if (user.resetCode !== parseInt(code)) {
      return NextResponse.json({ success: false, message: 'Incorrect code' }, { status: 400 });
    }
     if (now > user.resetCodeExpiry) {
      return NextResponse.json({ success: false, message: 'Code has expired' }, { status: 400 });
    }
        user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();
     return NextResponse.json({ success: true, message: 'Code verified successfully' });
    }
     catch (error) {
    console.error('Error verifying reset code:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}