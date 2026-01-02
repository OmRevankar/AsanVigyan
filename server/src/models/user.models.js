import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            index:true
        },

        email : {
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },

        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },

        profileImage:{
            type:String,
            required:true
        },

        password:{
            type:String,
            required:true
        },

        dob : {
            type:Date,
            required:true
        },

        refreshToken : {
            type:String,
        }

    },{timestamps:true});


export const User = mongoose.model("User",userSchema);