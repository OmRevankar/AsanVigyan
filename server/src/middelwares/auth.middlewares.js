import { Admin } from "../models/admin.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

const verifyJWT = asyncHandler( async (req,res,next) => {

    const accessToken = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer","");
    
    try {

        if(!accessToken)
            return res.status(451).json( new ApiError(451,"No access Token present in the Browser => User hasn't logged in") );
    
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken)
            return res.status(452).json(new ApiError(452,"Failed to decode token"));
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user)
            return res.status(452).json( new ApiError(452,"Expired Access token present in Browser") );
    
        req.user = user;
        next();

    } catch (error) {
        
        if(error.name == "TokenExpiredError")
            return res.status(452).json( new ApiError(452,"Expired Access token present in Browser : TokenExpiredError :)") );

        return res.status(422).json(new ApiError(422,"Token present in Browser but undefined"))

    }

} );

const adminJWT = asyncHandler(async (req,res,next) => {

    try {

        const accessToken = req.cookies?.accessToken || req.headers['Authorization']?.replace("Bearer","");
    
        if(!accessToken)
            return res.status(451).json(new ApiError(451,"Access token absent in browser"));
    
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken)
            return res.status(451).json(new ApiError(451,"Failed to decode token"));

        const admin = await Admin.findById(decodedToken?._id);

        if(!admin)
            return res.status(451).json(new ApiError(451,"Expired Access token present in browser"));

        req.admin = admin;
        next();

    } catch (error) {

        if(error.name === "TokenExpiredError")
        {
            return res.status(452).json(new ApiError(452,"Expired Access token present in Browser : TokenExpiredError :)"));
        }

        return res.status(422).json(new ApiError(422,"Token present in Browser but undefined"))        
    }

})

export {verifyJWT,adminJWT};