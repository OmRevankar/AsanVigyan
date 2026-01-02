import mongoose from 'mongoose'

const testSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },

        responses : {
            type : [
                {
                    qid : mongoose.Schema.Types.ObjectId,
                    selectedOption : Number,
                    status : {
                        type : String,
                        enum : ["correct","wrong","skipped"],
                        required : true
                    }
                }
            ]
        },

        score : {
            type : Number,
            required : String
        }
        
    }
    ,{timestamps:true});

export const Test = mongoose.model("Test",testSchema);