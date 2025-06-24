import { NextResponse } from "next/server";
import Auth from "@/app/model/userSchema";
import { connectDB } from "@/app/Lib/connect";
import nodemailer from 'nodemailer'
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const user = await Auth.findOne({ email })
        if (!user) {
            return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });
        }
        const code = Math.floor(100000 + Math.random() * 900000); 
        user.resetCode = code;
        user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset code",
            text: `Your password reset code is: ${code}. It will expire in 10 minutes.`,
        }
        
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Code sent to email" });
    }
    catch (error) {
    console.error("Error in sending reset code:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } 
}