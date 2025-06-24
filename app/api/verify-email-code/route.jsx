import { NextResponse } from "next/server";
import Auth from "@/app/model/userSchema";
import { connectDB } from "@/app/Lib/connect";
import Verification from "@/app/model/verficationSchema";
import bcrypt from 'bcryptjs'
export async function POST(req) {
    try {
        await connectDB();
    const { email,code,password,username } = await req.json();
   
    const verification= await Verification.findOne({email});

    const now = Date.now();
    if (code != parseInt(verification.code)) {
        return NextResponse.json({ success: false, message: 'Incorrect code' }, { status: 400 });
    }
    if(now>verification.expiry) {
          return NextResponse.json({ success: false, message: 'Code has been expired' }, { status: 400 });
    }
        const hashedPassword = await bcrypt.hash(password,10);
       
         await Auth.create({email,username,password:hashedPassword});
             await Verification.deleteOne({ email });
                return NextResponse.json({success:true,message:"User created  successfully"})
}
catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
