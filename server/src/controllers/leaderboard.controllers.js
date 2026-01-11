//high score in a game
//high attempts
//highest total score

import { Test } from "../models/test.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const totalScore = asyncHandler(async (req, res) => {

    const leaderboard = await Test.aggregate([
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
            $addFields: {
                username: "$user.username",
                fullName: "$user.fullName",
                userId : "$user._id"
            }
        },
        {
            $group: {
                _id: "$userId",
                username: { $first: "$username" },
                lifeTimeScore: { $sum: "$score" }
            }
        },
        {
            $sort: {
                lifeTimeScore: -1
            }
        },
        {
            $limit : 10
        }
    ]);

    if (!leaderboard)
        return res.status(400).json(new ApiError(400, "Failed to fetch leaderboard"));

    return res.status(200).json(new ApiResponse(200, leaderboard, "Successfully fetched leaderboard"));

});

const highScore = asyncHandler(async (req, res) => {

    const leaderboard = await Test.aggregate([
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
            $addFields: {
                username: "$user.username",
                fullName: "$user.fullName",
            }
        },
        {
            $sort: {
                score: -1,
                createdAt: 1
            }
        },
        {
            $project : {
                uid : 1,
                username : 1,
                fullName : 1,
                score : 1,
                createdAt : 1,
                userId : 1
            }
        },
        {
            $limit : 10
        }
    ]);

    if (!leaderboard)
        return res.status(400).json(new ApiError(400, "Failed to fetch leaderboard"));

    return res.status(200).json(new ApiResponse(200, leaderboard, "Successfully fetched leaderboard"));

});

const totalAttempts = asyncHandler(async (req, res) => {

    const leaderboard = await Test.aggregate([
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
            $addFields: {
                username: "$user.username",
                fullName: "$user.fullName"
            }
        },
        {
            $group: {
                _id: "$userId",
                username: { $first: "$username" },
                attempts: { $sum: 1 }
            }
        },
        {
            $sort : {
                attempts : -1
            }
        },
        {
            $limit : 10
        }
    ]);

    if (!leaderboard)
        return res.status(400).json(new ApiError(400, "Failed to fetch leaderboard"));

    return res.status(200).json(new ApiResponse(200, leaderboard, "Successfully fetched leaderboard"));

})

export {
    totalScore,
    highScore,
    totalAttempts
}