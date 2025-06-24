import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
  resetCode: {type: Number,default: null},
resetCodeExpiry: {type: Date,default: null}
});

// Prevent model overwrite error
const Auth = mongoose.models.Auth || mongoose.model("Auth", userSchema);

export default Auth;
