// beginTest
// submitTest
// fetch
// fetchAll

import mongoose from "mongoose";
import { Question } from "../models/question.models.js";
import { Test } from "../models/test.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const beginTest = asyncHandler(async (req, res) => {

    const {category} = req.body;

    if(!category || category.trim() === '')
        return res.status(400).json(new ApiError(400,'Catgeory is missing'));

    const questions = await Question.aggregate([
        {$match : {category:category} },
        { $sample: { size: 5 } },
        {
            $project: {
                description: 1,
                options: 1,
                value: 1,
                questionImage: 1,
                uid: 1
            }
        }
    ])

    console.log(questions);

    if (!questions)
        return res.status(400).json(new ApiError(400, "Failed to fetch questions"));

    return res.status(200).json(new ApiResponse(200, questions, "Successfully fetched questions"))

});

// const submitTest = asyncHandler( async(req,res) => {

//     const {response} = req.body;

//     const dummy_response = [
//     {
//         uid : 1,
//         description : "",
//         value : 2,
//         correctOption : 2,
//         selectedOption : 2,
//         options : [{ "id":1, "text" : "Mango" } , { "id":2, "text" : "Apple" } , { "id":3, "text" : "Banana" } , { "id":4, "text" : "Orange" }],
//         questionImage : ""
//     },
//     {
//         uid : 1,
//         description : "",
//         value : 2,
//         correctOption : 2,
//         selectedOption : 2,
//         options : [{ "id":1, "text" : "Mango" } , { "id":2, "text" : "Apple" } , { "id":3, "text" : "Banana" } , { "id":4, "text" : "Orange" }],
//         questionImage : ""
//     },
//     {
//         uid : 1,
//         description : "",
//         value : 2,
//         correctOption : 2,
//         selectedOption : 2,
//         options : [{ "id":1, "text" : "Mango" } , { "id":2, "text" : "Apple" } , { "id":3, "text" : "Banana" } , { "id":4, "text" : "Orange" }],
//         questionImage : "",
//         status : "unattempted",
//         score : 0
//     }
// ];

//     let score = 0;

//     const cal_resp = response.map( (item,index) => {

//         if(item.selectedOption === 0)
//             item.status = "unattempted"

//         if(item.selectedOption === item.correctOption)
//         {
//             score += item.value;
//             item.status = "correct";
//             item.score = item.value
//         }
//         else
//         {
//             item.status = 'incorrect'
//         }

//         return item;

//     } );

//     const test = await Test.create(
//         {
//             userId : req.user?._id,
//             responses : cal_resp,
//             score
//         }
//     );

//     const findTest = await Test.findById(test?._id);

//     if(!findTest)
//         return res.status(400).json(new ApiError(400,"Failed to create a Test instance"));

//     return res.status(200).json(new ApiResponse(200,findTest,"Test completed successfully"));

// } )

const submitTest = asyncHandler(async (req, res) => {

    const { response } = req.body;
    let totalScore = 0;

    // console.log("IN controller");
    // console.log(response);

    const dummy_res = [{ uid: 1, selectedOption: 2 }, { uid: 1, selectedOption: 2 }];

    const uidStore = response.map((item) => item.uid);

    const dbQuestions = await Question.find({
        uid: { $in: uidStore }
    });

    const questionMap = new Map();

    dbQuestions.map((item) => {
        questionMap.set(item.uid, item);
    });

    const cal_res = response.map((item) => {

        let qn = questionMap.get(item.uid);

        let score = 0;
        let status = 'unattempted';

        if (item.selectedOption !== 0 && item.selectedOption === qn.correctOption) {
            score += qn.value;
            totalScore += qn.value;
            status = "correct"
        }
        else if (item.selectedOption !== 0 && item.selectedOption !== qn.correctOption) {
            status = 'incorrect';
        }
        else if(item.selectedOption === 0)
            status = 'unattempted';

        return {
            uid: qn.uid,
            score,
            status,
            selectedOption: item.selectedOption
        }

    });

    // console.log(cal_res);

    const testInstance = await Test.create({
        userId: req.user?._id,
        responses: cal_res,
        score: totalScore,
        uid: 999
    })

    const findTest = await Test.aggregate([
        { $match: { _id: testInstance?._id } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] }
            }
        },
        {
            $addFields: {
                "username": "$user.username"
            }
        },
        {
            $addFields: {
                "fullName": "$user.fullName"
            }
        },
        {
            $unwind: "$responses"
        },
        {
            $lookup: {
                from: "questions",
                localField: "responses.uid",
                foreignField: "uid",
                as: "question"
            }
        },
        {
            $unwind: "$question"
        },
        {
            $addFields: {
                "responses.question": "$question"
            }
        },
        {
            $group: {
                _id: "$_id",
                uid: { $first: "$uid" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                score: { $first: "$score" },
                username: { $first: "$username" },
                fullName: { $first: "$fullName" },
                userId: { $first: "$userId" },
                responses: { $push: "$responses" },
            }
        }

    ]);

    console.log("Find Test : ", findTest);

    if (!findTest)
        return res.status(400).json(new ApiError(400, "Failed to create Test instance"));

    return res.status(200).json(new ApiResponse(200, findTest, "Successfully submitted test"))

});

const fetchTest = asyncHandler(async (req, res) => {

    const { uid } = req.body;

    const test = await Test.aggregate([
        { $match: { uid } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] }
            }
        },
        {
            $addFields: {
                "username": "$user.username"
            }
        },
        {
            $addFields: {
                "fullName": "$user.fullName"
            }
        },
        {
            $unwind: "$responses"
        },
        {
            $lookup: {
                from: "questions",
                localField: "responses.uid",
                foreignField: "uid",
                as: "question"
            }
        },
        {
            $unwind: "$question"
        },
        {
            $addFields: {
                "responses.question": "$question"
            }
        },
        {
            $group: {
                _id: "$_id",
                uid: { $first: "$uid" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                score: { $first: "$score" },
                username: { $first: "$username" },
                fullName: { $first: "$fullName" },
                userId: { $first: "$userId" },
                responses: { $push: "$responses" },
            }
        }

    ]);

    if (!test)
        return res.status(400).json(new ApiError(400, "Failed to fetch the test"));

    return res.status(200).json(new ApiResponse(200, test, "Fetched test successfully"));


});

const fetchAll = asyncHandler(async (req, res) => {

    console.log("HI in con")

    const test = await Test.aggregate([
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
            $unwind: "$responses"
        },
        {
            $lookup: {
                from: "questions",
                localField: "responses.uid",
                foreignField: "uid",
                as: "question"
            }
        },
        {
            $unwind: "$question"
        },
        {
            $addFields: {
                "responses.question": "$question"
            }
        },
        {
            $group: {
                _id: "$_id",
                uid : { $first: "$uid" },
                responses: { $push: "$responses" },
                createdAt: { $first: "$createdAt" },
                userId: { $first: "$userId" },
                username: { $first: "$user.username" },
                fullName: { $first: "$user.fullName" },
                score: { $first: "$score" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    if (!test)
        return res.status(400).json(new ApiError(400, "Failed to fetch the tests"));

    return res.status(200).json(new ApiResponse(200, test, "Fetched all tests successfully"));

})

const fetchUserTestHistory = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    // console.log("HI in con")

    const testHistory = await Test.aggregate([
        { $match: { userId } },
        {
            $unwind: "$responses"
        },
        {
            $lookup: {
                from: "questions",
                localField: "responses.uid",
                foreignField: "uid",
                as: "question"
            }
        },
        {
            $unwind: "$question"
        },
        {
            $addFields: {
                "responses.question": "$question"
            }
        },
        {
            $group: {
                _id: "$uid",
                responses: { $push: "$responses" },
                score: { $first: "$score" },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    if (!testHistory)
        return res.status(400).json(new ApiError(400, "Failed to fetch the test history"));

    return res.status(200).json(new ApiResponse(200, testHistory, "Fetched user test history successfully"));

});

const fetchUserTestHistoryAdmin = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    if (!userId || userId.trim() === "")
        return res.status(400).json(new ApiError(400, "User Id is required"));

    const mongooseUserId = new mongoose.Types.ObjectId(userId);

    const testHistory = await Test.aggregate([
        { $match: { userId: mongooseUserId } },
        {
            $unwind: "$responses"
        },
        {
            $lookup: {
                from: "questions",
                localField: "responses.uid",
                foreignField: "uid",
                as: "question"
            }
        },
        {
            $unwind: "$question"
        },
        {
            $addFields: {
                "responses.question": "$question"
            }
        },
        {
            $group: {
                _id: "$uid",
                responses: { $push: "$responses" },
                score: { $first: "$score" },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    // console.log(testHistory);

    if (!testHistory)
        return res.status(400).json(new ApiError(400, "Failed to fetch the test history"));

    return res.status(200).json(new ApiResponse(200, testHistory, "Fetched user test history successfully"));

});

export {
    beginTest,
    submitTest,
    fetchTest,
    fetchAll,
    fetchUserTestHistory,
    fetchUserTestHistoryAdmin
}