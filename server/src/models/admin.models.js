import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true
        },

        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true
        },

        password : {
            type : String,
            required : true
        },

        profileImage : {
            type : String,
            required:true
        },

        refreshToken : {
            type : String
        }
    }
    ,{timestamps:true});


adminSchema.pre('save',function(next){

    if(!this.isModified('password')) return next();

    this.password = bcrypt.hashSync(this.password,10);
    next();

})

adminSchema.methods.isPasswordCorrect = async function(inpPassword){

    const result = await bcrypt.compare(inpPassword,this.password);
    return result;

}

adminSchema.methods.generateAccessToken = function(){

    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

adminSchema.methods.generateRefreshToken = function(){

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


export const Admin = mongoose.model("Admin",adminSchema);