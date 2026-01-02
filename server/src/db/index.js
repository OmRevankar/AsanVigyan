import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async function(){

    try {
        
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("DB Connection Successfull :",response.connection.host);

    } catch (error) {
        console.log("Database Connection Error :",error)
    }

};

export default connectDB;