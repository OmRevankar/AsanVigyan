import mongoose from 'mongoose'
import { Counter } from './counter.models.js';

const testSchema = new mongoose.Schema(
    {
        uid : {
            type : Number,
            required : true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        responses: {
            type: [
                {
                    uid: Number,
                    selectedOption: Number,
                    status: {
                        type: String,
                        enum: ["correct", "incorrect", "unattempted"],
                        required: true
                    },
                    score: Number
                }
            ]
        },

        score: {
            type: Number,
            required: true
        }

    }
    , { timestamps: true });


testSchema.pre("save",async function(next){

    if(!this.isNew)
        return next();

    try {

        const counter = await Counter.findOneAndUpdate(
            {id : "test_uid"},
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

export const Test = mongoose.model("Test", testSchema);