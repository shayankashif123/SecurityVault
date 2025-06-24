import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date
});

const Verification = mongoose.models.Verification || mongoose.model("Verification", verificationSchema);
export default Verification