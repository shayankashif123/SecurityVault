import { NextResponse } from "next/server";
import Auth from "@/app/model/userSchema";
import { connectDB } from "@/app/Lib/connect";
import bcrypt from 'bcryptjs'
export async function POST(req) {
    try{
        await connectDB();
    const {email,password} = await req.json();
    const user = await Auth.findOne({email});
    const hashedPassword = await bcrypt.hash(password,10);
    user.password=hashedPassword;
        await user.save();
        return NextResponse.json({success:true,message:"Password reset successfully"})
}
catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}