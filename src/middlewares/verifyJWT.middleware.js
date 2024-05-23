import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Student } from "../models/students.model.js";


// #video 16 
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request in JWT")
        }
    
        // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // //duration 45 min
        // //decoded token will send the payload you sent during creation of model
        // const student = await Student.findById(decodedToken?._id).select("-password -refreshToken")
    
        // if (!student) {
            
        //     throw new ApiError(401, "Invalid Access Token")
        // }
    
        // req.student = student;
        // next()

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            next();
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            })
        }
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})