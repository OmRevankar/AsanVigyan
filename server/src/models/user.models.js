import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            index:true
        },

        // email : {
        //     type:String,
        //     required:true,
        //     unique:true,
        //     lowercase:true
        // },

        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },

        // phone : {
        //     type : Number,
        //     required : true,
        //     unique : true
        // },

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

userSchema.pre('save',function(next){

    if(!this.isModified('password')) return next();

    this.password = bcrypt.hashSync(this.password,10);
    next();

})

userSchema.methods.isPasswordCorrect = async function(inpPassword){

    const result = await bcrypt.compare(inpPassword,this.password);
    return result;

}

userSchema.methods.generateAccessToken = function(){

    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema);