import mongoose from "mongoose";

const Schema = new mongoose.Schema({
      userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Auth",
    required: true 
  },
    app:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
})
const Password = mongoose.models.Password || mongoose.model("Password", Schema);
export default Password;