import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors
//urlencoded
//json
//static
//cookie

// app.use(cors( {
//     origin:process.env.CORS_ORIGIN,
//     credentials : true,
// } ))

const originString = process.env.CORS_ORIGIN;
const allowedOrigins = originString.split(",");

app.use(cors({
    origin : function(origin,callback){

        if(!origin) return callback(null,true);

        if(allowedOrigins.includes(origin)) 
            return callback(null,true);
        else
            return callback(new Error("Not Allowed by CORS"))

    },
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true , limit:"16kb"}));

app.use(express.static('public'));


app.use(cookieParser());

// ROUTES
import userRouter from './routes/user.routes.js'
import adminRouter from "./routes/admin.routes.js";
import questionRouter from "./routes/question.routes.js";
import testRouter from "./routes/test.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";

app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/question',questionRouter);
app.use('/api/v1/test',testRouter);
app.use('/api/v1/leaderboard',leaderboardRouter)

export default app