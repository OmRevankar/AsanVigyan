import mongoose from 'mongoose'
import { Counter } from './counter.models.js';

const questionSchema = new mongoose.Schema(
    {
        uid: {
            type : Number,
            required : true,
            unique: true,
            index : true
        },

        description: {
            type : String,
            required : true,
            index : true
        },

        questionImage : {
            type : String
        },

        options : {
            type : [{
                id : {
                    type : Number,
                    required : true,
                    enum : [1,2,3,4]
                },

                text : {
                    type : String,
                    required : true
                }
            }]
        },

        correctOption : {
            type : Number,
            enum: [1,2,3,4]
        },

        value : {
            type : Number,
            default : 1
        }
    }
    ,{timestamps:true});

questionSchema.pre("save",async function(next){

    if(!this.isNew)
        return next();

    try {

        const counter = await Counter.findOneAndUpdate(
            {id : "question_uid"},
            {
                $inc : {
                    seq : 1
                }
            },
            {
                new : true,
                upsert : true
            }
        );
    
        this.uid = counter.seq;
        next();

    } catch (err) {
        next(err);
    }

});

export const Question = mongoose.model("Question",questionSchema);