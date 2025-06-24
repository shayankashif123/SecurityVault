import mongoose from "mongoose";
let isConnected = false;
export const connectDB = async () => {
    try{
        if (isConnected) {
            console.log("MongoDB is already connected");
            return;
        }
        else {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
        isConnected = true;
        }
    }
    catch(err) {
        console.error("MongoDB connection error:", err);
    }
}