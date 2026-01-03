
import { Admin } from "../models/admin.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import fs from 'fs'
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

//create
// login
// fetch
// update
// logout

const startSession = async (admin_id) => {

    try {
        const admin = await Admin.findById(admin_id);
    
        const refreshToken = admin.generateRefreshToken();
        const accessToken = admin.generateAccessToken();

        admin.refreshToken = refreshToken;

        admin.save({validateBeforeSave:false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(400,"Failed to start new session");
    }

}

const createAdmin = asyncHandler(async (req,res) => {

    const {fullName,username,password} = req.body;

    if([fullName,username,password].some((a) => !a || a.trim() === ""))
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Incomplete Details"));
    }

    const existingAdmin = await Admin.findOne({username});

    if(existingAdmin)
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"username is already taken"));
    }

    const profileImageLocalPath = req.file?.path;

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image required"));


    const uploadRes = await uploadOnCloudinary(profileImageLocalPath);

    if(!uploadRes)
        return res.status(400).json(new ApiError(400,"Failed to upload on Cloudinary"));

    const admin = await Admin.create({
        fullName,
        username,
        password,
        profileImage : uploadRes?.url
    });

    const findAdmin = await Admin.findById(admin?._id).select("-password -refreshToken");

    if(!findAdmin)
        return res.status(400).json(new ApiError(400,"Failed to create Admin"));

    return res.status(200).json(new ApiResponse(
        200,
        findAdmin,
        "Admin created Successfully"
    ))

});

const loginAdmin = asyncHandler(async (req,res) => {

    const {username,password} = req.body;

    if([username,password].some((a) => !a || a.trim() === ""))
    {
        return res.status(400).json(new ApiError(400,"Incomplete Details"));
    }

    const admin = await Admin.findOne({username}).select("-password -refreshToken");

    if(!admin)
        return res.status(400).json(new ApiError(400,"Admin with this Username doesn't exists"));

    const resp = admin.isPasswordCorrect(password);

    if(!resp)
        return res.status(400).json(new ApiError(400,"Incorrect Password"));

    const {accessToken,refreshToken} = startSession(admin?._id);

    const options = {
        httpOnly : true,
        secure : true
    };

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,admin,"Admin logged in successfully"));

});

const updateAdmin = asyncHandler(async (req,res) => {

    const {fullName,username,password} = req.body;

    if([fullName,username,password].some((a)=> !a || a.trim() === ""))
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Incomplete Details"));
    }

    const exisitingAdmin = await Admin.findOne({username});

    if(exisitingAdmin)
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Username cant be used"));
    }

    const profileImageLocalPath = req.file?.path;

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image is required"));

    
    const deleteResp = await deleteFromCloudinary(req.user?.profileImage);

    if(!deleteResp)
        console.log("Failed to delete image from cloudinary");

    const uploadResp = await uploadOnCloudinary(profileImageLocalPath);

    if(!uploadResp)
        return res.status(400).json(new ApiError(400,"Failed to upload image on cloudinary"));

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $set : {
                fullName,
                username,
                password,
                profileImage : uploadResp?.url
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            admin,
            "Admin updated Successfully"
        )
    )

});

const logoutAdmin = asyncHandler(async (req,res) => {

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
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
    .json( new ApiResponse (
        200,
        {},
        "Admin logged out successfully"
    ) )    

});

const fetchAdmin = asyncHandler( async (req,res) => {

    return res.status(200).json(new ApiResponse(200,req.admin,"Admin fetched successfully"));

} )

export {
    createAdmin,
    loginAdmin,
    updateAdmin,
    logoutAdmin,
    fetchAdmin
};