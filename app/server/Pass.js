"use server"
import { connectDB } from "../Lib/connect";
import Password from "../model/Schema";

export const addPassword = async (data, userId) => {
    try {
        await connectDB();
        const { app, username, password } = data;
        const newPassword = await Password.create({ app, username, password, userId });
        console.log("Password saved successfully");
        return {
            success: true,
            password: {
                id: newPassword._id.toString(),
                app: newPassword.app,
                username: newPassword.username,
                password: newPassword.password
            }
        };
    } catch (err) {
        console.error("Error saving password:", err);
        return { success: false, error: err.message };
    }
}


export const getPassword=async(userId)=>{
    try{
        await connectDB();
        const passwords= await Password.find({userId});
        const serializedPasswords = passwords.map((password) => {
            return {
                id: password._id.toString(),
                app: password.app,
                username: password.username,
                password: password.password
            }
        });
        return serializedPasswords;
    } catch(err){
        console.error("Error fetching passwords:", err);
    }
}
export const deletePassword=async(id)=>{
    try{
        await connectDB();
      await Password.findByIdAndDelete(id);   
    }
    catch(err) {
        console.log("Error in deleting passwords",err);
    }
}
export const updatePassword=async(id,data)=>{
    try{
        await connectDB();
        const updatedPassword = await Password.findByIdAndUpdate(
            id,
            data,
            { new: true } 
          );
      const plainObj= updatedPassword.toObject();
    plainObj._id = plainObj._id.toString();
        return plainObj;
            }
                catch(err) {
        console.log("Error in updating passwords",err);
    }   
}