import { NextResponse } from "next/server";
import { connectDB } from "@/app/Lib/connect";
import Auth from "@/app/model/userSchema";
import nodemailer from 'nodemailer'
import Verification from "@/app/model/verficationSchema";
export async function POST(req) {
    try {
        await connectDB();
        const {email}=await req.json();
        const user = await Auth.findOne({ email });
        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }
        const code = Math.floor(Math.random() * 900000)+ 100000;
        const expiryTime = Date.now() + 10 * 60 * 1000;
        const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Your email confirmation code",
            text:`Your email confirmation code is ${code}.It will expire in 10 minutes`
        }
        await transporter.sendMail(mailOptions);
        await Verification.create({email,code,expiresAt:expiryTime});
         return NextResponse.json({ success: true, message: "Code sent to email" });

    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
