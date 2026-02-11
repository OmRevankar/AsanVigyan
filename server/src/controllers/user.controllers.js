
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import bcrypt from 'bcrypt'
import { Test } from "../models/test.models.js";
import mongoose from "mongoose";
import { use } from "react";

// register
// login
// updateDetails
// updateProfileImage
// logout
// fetchUser
// fetch all users

const startSession = async (user_id) => {

    try {
        const user = await User.findById(user_id);

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;

        user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };

    } catch (error) {
        throw new ApiError(400, "Failed to start session");
    }

}

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, password, username, dob , avatar } = req.body;

    // console.log("HI")

    if ([fullName, password, username, dob , avatar].some((a) => !a || a.trim() === "")) {

        // if (req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400, "Details are missing"));
    }

    // console.log(typeof(phone))

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        // if (req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400, "User with same username already exits"));
    }

    // const profileImageLocalPath = req.file?.path;

    // if (!profileImageLocalPath)
    //     return res.status(400).json(new ApiError(400, "Profile Image missing"));


    // const cloudinaryResp = await uploadOnCloudinary(profileImageLocalPath);

    // if (!cloudinaryResp)
    //     return res.status(400).json(new ApiError(400, "Failed to upload on Cloudinary"));

    const user = await User.create({
        fullName,
        username,
        password,
        dob,
        avatar
        // profileImage: cloudinaryResp?.url,
    })

    const findUser = await User.findById(user?._id).select("-password -refreshToken");

    if (!findUser)
        return res.status(400).json(new ApiError(400, "Failed to create User"));

    return res.status(200).json(
        new ApiResponse(
            200,
            findUser,
            "User created successfully"
        ));

})

const loginUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    // console.log("HI");

    if ([username, password].some((item) => !item || item.trim() === "")) {
        return res.status(400).json(new ApiError(400, "Details are missing"))
    }

    // if(!phone)
    //     return res.status(400).json(new ApiError(400,"Phone number missing"));

    const user = await User.findOne({ username });

    if (!user)
        return res.status(400).json(new ApiError(400, "User with the details does not exist"));

    const resp = await user.isPasswordCorrect(password);

    if (!resp)
        return res.status(400).json(new ApiError(400, "Incorrect Password"));

    const userInstance = await User.findById(user?._id).select("-password -refreshToken");

    const { accessToken, refreshToken } = await startSession(userInstance?._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userInstance,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    const user = req.user;

    await User.findByIdAndUpdate(
        user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    return res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "User logged out successfully"));

})

const updateUser = asyncHandler(async (req, res) => {

    const { fullName, username, password , avatar } = req.body;

    if ([fullName, username].some((a) => !a || a.trim() === "")) {
        // if (req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json("Incomplete details");
    }

    const ava = ['astronaut','bear','chicken','giraffe','knight','meerkat','ninja','panda','rabbit','robot'];

    if(avatar && !ava.includes(avatar))
        return res.status(400).json("Invalid Avatar details");

    const findUser = await User.findOne({ username });

    if (findUser && username != req.user?.username) {
        if (req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400, "Username is not available"));
    }

    // const profileImageLocalPath = req.file?.path;
    // let uploadRes;

    // if (profileImageLocalPath) {

    //     uploadRes = await uploadOnCloudinary(profileImageLocalPath);

    //     if (!uploadRes) {
    //         return res.status(400).json(new ApiError(400, "Failed to upload on cloudinary"));
    //     }

    //     const cloudinaryPublicId = req.user?.profileImage.split('/');
    //     const deleteRes = await deleteFromCloudinary(cloudinaryPublicId[cloudinaryPublicId.length - 1].split('.')[0]);

    //     if (!deleteRes)
    //         console.log("Failed to Delete the old image from Cloudinary");
    // }

    let hashedPassword;

    if (password) hashedPassword = bcrypt.hashSync(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                username,
                password: hashedPassword ? hashedPassword : undefined,
                avatar : avatar ? avatar : undefined
                /*profileImage: profileImageLocalPath ? uploadRes?.url : undefined */
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(
        200,
        updatedUser,
        "User updated Successfully"
    ))

})

const fetchUser = asyncHandler(async (req, res) => {

    // return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));

    console.log("HI inside cotroller");

    let userInfo

    userInfo = await Test.aggregate([
        { $match: { userId: req.user?._id } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $sort: {
                "score": -1,
                "createdAt": 1
            }
        },
        {
            $group: {
                _id: "$userId",
                totalScore: { $sum: "$score" },
                highScore: { $first: "$score" },
                totalAttempts: { $sum: 1 },
                username: { $first: "$user.username" },
                fullName: { $first: "$user.fullName" },
                avatar : {$first : "$user.avatar"},
                /*profileImage: { $first: "$user.profileImage" },*/
                dob: { $first: "$user.dob" },

            }
        }
    ]);

    // console.log(userInfo.length);

    if (userInfo.length === 0) {
        const newInfo = await User.aggregate([
            { $match: { _id: req.user?._id } },
            {
                $addFields: {
                    totalAttempts: 0,
                    highScore: 0,
                    totalScore: 0
                }
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0
                }
            }
        ])

        userInfo = newInfo;
    }

    if (userInfo.length === 0)
        return res.status(400).json(new ApiError(400, "Failed to fetch user Data"));

    return res.status(200).json(new ApiResponse(200, userInfo, 'Successfully fetched user details'));

});

const fetchOtherUser = asyncHandler(async (req, res) => {

    // return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
    console.log("HIII")
    const { userId } = req.body;

    if (!userId || userId.trim() == "")
        return res.status(400).json(new ApiError(400, "userId required"));

    const user = new mongoose.Types.ObjectId(userId);

    let userInfo;

    userInfo = await Test.aggregate([
        { $match: { userId: user } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $sort: {
                "score": -1,
                "createdAt": 1
            }
        },
        {
            $group: {
                _id: "$userId",
                totalScore: { $sum: "$score" },
                highScore: { $first: "$score" },
                totalAttempts: { $sum: 1 },
                username: { $first: "$user.username" },
                fullName: { $first: "$user.fullName" },
                avatar : {$first : "$user.avatar"},
                /*profileImage: { $first: "$user.profileImage" },*/
                dob: { $first: "$user.dob" },

            }
        }
    ]);

    if (userInfo.length === 0)
    {
        userInfo = await User.aggregate([
            { $match: { _id: user } },
            {
                $addFields: {
                    totalAttempts: 0,
                    highScore: 0,
                    totalScore: 0
                }
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0
                }
            }
        ])
    }

    if (!userInfo)
        return res.status(400).json(new ApiError(400, "Failed to fetch user Data"));

    return res.status(200).json(new ApiResponse(200, userInfo, 'Successfully fetched user details'));

});


export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    fetchUser,
    fetchOtherUser
}