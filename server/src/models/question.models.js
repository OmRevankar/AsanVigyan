import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        question: {
            type : String,
            required : true,
            index : true
        },

        image : {
            type : String
        },

        options : {
            type : [{
                type : String,
                _id : Number
            }]
        },

        correctOption : {
            type : Number
        },

        value : {
            type : Number
        }
    }
    ,{timestamps:true});

export const Question = mongoose.model("Question",questionSchema);