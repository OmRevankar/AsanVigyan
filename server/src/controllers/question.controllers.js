import fs from 'fs';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Question } from "../models/question.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create
// fetch
// fetchAll
// update
// delete

const createQuestion = asyncHandler( async (req,res) => {

    const {description,options,correctOption,value} = req.body;

    //parse
    const parsedCorrectOption = Number(correctOption);
    const parsedValue = Number(value);

    // console.log("hi");
    // console.log(typeof(options))
    let parsedOptions;
    parsedOptions = typeof(options) == "string" ? JSON.parse(options) : options;
    console.log("hi");

    console.log(typeof(parsedCorrectOption),typeof(parsedValue),typeof(parsedOptions));
    console.log(parsedOptions);
    console.log(parsedCorrectOption);
    console.log(parsedValue)

    if(!description || Number.isNaN(parsedCorrectOption) || Number.isNaN(value) )
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Incomplete Data"))
    }

    if(!Array.isArray(parsedOptions) || parsedOptions.length !== 4)
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Options Data is in incorrect format"));
    }

    const validateOption = parsedOptions.some( (item) => item.id === parsedCorrectOption );

    if(!validateOption)
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Correct option must be within the provided options"));
    }

    const image = req.file?.path;
    let uploadResp;

    if(image)
    {

        uploadResp = await uploadOnCloudinary(image);

        if(!uploadResp)
        {
            return res.status(400).json(new ApiError(400,"Failed to upload on cloudinary"));
        }

    }

    const question = await Question.create({
        description,
        options : parsedOptions,
        correctOption : parsedCorrectOption,
        value : parsedValue,
        questionImage : uploadResp ? uploadResp?.url : undefined,
        createdBy : req?.admin._id,
        uid : 999
    });

    const findQuestion = await Question.findById(question?._id);

    if(!findQuestion)
    {
        return res.status(400).json(new ApiError(400,"Failed to create question"));
    }

    return res.status(200).json(new ApiResponse(200,findQuestion,"Question screated successfully"));

} )

const updateQuestion = asyncHandler( async (req,res) => {

    const {description,options,correctOption,value,uid} = req.body;

    const parsedCorrectOption = Number(correctOption);
    const parsedValue = Number(value);
    const parsedUid = Number(uid);

    const parsedOptions = typeof(options) === "string" ? JSON.parse(options) : options;

    if(!description || Number.isNaN(parsedCorrectOption) || Number.isNaN(parsedValue) || Number.isNaN(parsedUid))
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Incomplete or invalid data"));
    }

    if(!Array.isArray(parsedOptions) || parsedOptions.length != 4)
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"invalid options"));
    }

    const validateOptions = parsedOptions.some(item => item.id === parsedCorrectOption);

    if(!validateOptions)
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Correct option is not within the given options"));
    }

    //check if that qn exits
    const findQn = await Question.findOne({uid : parsedUid});

    if(!findQn)
    {
        if(req.file?.path) fs.unlinkSync(req.file?.path);
        return res.status(400).json(new ApiError(400,"Can't find question with the given uid"))
    }

    let deleteRes;

    if(findQn.questionImage)
    {
        const qI = findQn?.questionImage.split('/');
        deleteRes = await deleteFromCloudinary(qI[qI.length - 1].split('.')[0]);
    }

    if(!deleteRes)
        console.log("Failed to delete image from cloudinary");

    const image = req.file?.path;
    let uploadRes;

    if(image)
    {
        uploadRes = await uploadOnCloudinary(image);

        if(!uploadRes)
            return res.status(400).json(new ApiError(400,"Failed to upload on cloudinary"));
    };

    const question = await Question.findByIdAndUpdate(
        findQn?._id,
        {
            $set : {
                description,
                options : parsedOptions,
                correctOption : parsedCorrectOption,
                value : parsedValue,
                questionImage : uploadRes?.url
            }
        },
        {
            new : true
        }
    );

    return res.status(200).json(new ApiResponse(200,question,"Question created successfully"));

} );

const deleteQuestion = asyncHandler(async (req,res) => {

    const {uid} = req.body;

    const parsedUid = Number(uid);

    if(Number.isNaN(parsedUid))
        return res.status(400).json(new ApiError(400,"Invalid UID"));

    const findQn = await Question.findOne({uid:parsedUid});

    if(!findQn)
        return res.status(400).json(new ApiError(400,"Failed to find the question with the uid"));

    const deleteRes = await Question.findByIdAndDelete(findQn?._id);

    if(!deleteRes)
        return res.status(400).json(new ApiError(400,"Failed to delete the question"));

    return res.status(200).json(new ApiResponse(200,{},"Deleted the question successfully"));

})

const fetchQuestion = asyncHandler(async (req,res) => {

    const {uid} = req.body;

    const parsedUid = Number(uid);

    if(Number.isNaN(parsedUid))
        return res.status(400).json(new ApiError(400,"Invalid UID"));

    const findQn = await Question.findOne({uid:parsedUid});

    if(!findQn)
        return res.status(400).json(new ApiError(400,"Failed to find the question with the uid"));

    return res.status(200).json(new ApiResponse(200,findQn,"Successfully fetched a Question"));

});

const fetchAllQuestions = asyncHandler(async (req,res) => {

    const questions = await Question.find();

    if(!questions)
        return res.status(400).json(new ApiError(400,"Failed to fetch all question"));

    return res.status(200).json(new ApiResponse(200,questions,"All questions fetched successfully"));

})

export {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestion,
    fetchAllQuestions
}