import dotenv from 'dotenv'
import app from "./app.js"
import connectDB from './db/index.js'
import 'dotenv/config';

// dotenv.config({
//     path : './.env'
// })

connectDB()
.then(()=>{

    app.on("error" , (error)=>{
        console.log("ERROR :",error);
        throw error;
    } )

    app.listen(process.env.PORT || 8080 , "0.0.0.0" , ()=>{
        console.log("Server is listening on PORT :", process.env.PORT);
    })    

})
.catch((error)=>{

    console.log("Server not started : DB Connection error" , error);

})