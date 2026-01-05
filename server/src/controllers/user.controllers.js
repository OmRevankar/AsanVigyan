
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import bcrypt from 'bcrypt'

// register
// login
// updateDetails
// updateProfileImage
// logout
// fetchUser
// fetch all users

const startSession = async (user_id) => {

    try {
        const user = await User.findById(user_id) ;
    
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
    
        user.refreshToken = refreshToken;
    
        user.save({validateBeforeSave:false});
    
        return {refreshToken,accessToken};

    } catch (error) {
        throw new ApiError(400,"Failed to start session");
    }

}

const registerUser = asyncHandler(async (req,res) => {

    const {fullName , email , phone , password , username , dob} = req.body;

    if([fullName , email , phone , password , username , dob].some( (a) => !a || a.trim() === "" )){

        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Details are missing"));
    }

    // console.log(typeof(phone))

    const existingUser = await User.findOne({
        $or : [{username},{phone},{email}]
    })

    if(existingUser)
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"User with similar username , phone or email already exits"));
    }

    const profileImageLocalPath = req.file?.path;

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image missing"));

    
    const cloudinaryResp = await uploadOnCloudinary(profileImageLocalPath);

    if(!cloudinaryResp)
        return res.status(400).json(new ApiError(400,"Failed to upload on Cloudinary"));

    const user = await User.create({
        fullName,
        username,
        email,
        phone,
        password,
        dob,
        profileImage : cloudinaryResp?.url
    })

    const findUser = await User.findById(user?._id).select("-password -refreshToken");

    if(!findUser)
        return res.status(400).json(new ApiError(400,"Failed to create User"));

    return res.status(200).json(
        new ApiResponse(
            200,
            findUser,
            "User created successfully"
        ));
 
})

const loginUser = asyncHandler(async (req,res) => {

    const {username,phone,email,password} = req.body;

    if([username,email,password].some((item) => !item || item.trim() === ""))
    {
        return res.status(400).json(new ApiError(400,"Details are missing"))
    }

    if(!phone)
        return res.status(400).json(new ApiError(400,"Phone number missing"));

    const user = await User.findOne({
        $and : [{username},{email},{phone}]
    });

    if(!user)
        return res.status(400).json(new ApiError(400,"User with the details does not exist"));

    const resp = await user.isPasswordCorrect(password);

    if(!resp)
        return res.status(400).json(new ApiError(400,"Incorrect Password"));

    const userInstance = await User.findById(user?._id).select("-password -refreshToken");

    const {accessToken,refreshToken} = await startSession(userInstance?._id);

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            userInstance,
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req,res) => {

    const user = req.user;

    await User.findByIdAndUpdate(
        user?._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    );

    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"User logged out successfully"));

})

const updateUser = asyncHandler(async (req,res) => {

    const {fullName,username,password} = req.body;

    if([fullName,username,password].some((a)=> !a || a.trim() === ""))
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json("Incomplete details");
    }

    const findUser = await User.findOne({ username });

    if(findUser && username != req.user?.username)
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Username is not available"));
    }

    const profileImageLocalPath = req.file?.path;

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image Missing"));

    const uploadRes = await uploadOnCloudinary(profileImageLocalPath);

    if(!uploadRes)
    {    
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Failed to upload on cloudinary"));
    }

    const cloudinaryPublicId = req.user?.profileImage.split('/');
    const deleteRes = await deleteFromCloudinary( cloudinaryPublicId[ cloudinaryPublicId.length - 1 ].split('.')[0] );

    if(!deleteRes)
        console.log("Failed to Delete the old image from Cloudinary");

    const hashedPassword = bcrypt.hashSync(password,10);

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                username,
                hashedPassword,
                profileImage : uploadRes?.url
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(
        200,
        updatedUser,
        "User updated Successfully"
    ))

})

const fetchUser = asyncHandler( (req,res) => {

    return res.status(200).json(new ApiResponse(200,req.user,"User fetched successfully"));

} )

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    fetchUser
}