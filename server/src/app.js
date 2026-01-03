import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors
//urlencoded
//json
//static
//cookie

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true , limit:"16kb"}));

app.use(express.static('public'));

app.use(cors( {
    origin:process.env.CORS_ORIGIN,
    credentials : true,
} ))

app.use(cookieParser());

// ROUTES
import userRouter from './routes/user.routes.js'
import adminRouter from "./routes/admin.routes.js";

app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter)

export default app