import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.models.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken =  async (admin_id)=>{
    try {
        const admin = await Admin.findById(admin_id);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
    
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false })
        return { accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "something went wrong while Tokens generation")
    }
}

const RegisterAdmin = asyncHandler( async(req, res)=>{
    //TODO: register admin
    const {userName, password, dept_name, incharge} = req.body;

    if([userName, password, dept_name, incharge].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "No feilds can be empty")
    }

    const isPresent = await Admin.findOne({userName});
    if(isPresent){
        throw new ApiError(400, "Admin already exists")
    }

    const admin = await Admin.create(
        {
            userName,
            password,
            dept_name,
            incharge
        }
    )

    const response = admin.toObject();
    if(!response){
        throw new ApiError(500, "coudn't add student")
    }
    delete response.password;
    
    return res.status(200).json(
        new ApiResponse(
            200, {response}, "successfully added the Admin"
        )
    )
})

const LoginAdmin = asyncHandler( async(req, res)=>{
    //TODO: login admin
    const {userName, password} = req.body;

    if(!userName || !password){
        throw new ApiError(400, "no entity can be empty")
    }

    const admin = await Admin.findOne({userName});
    if(!admin){
        throw new ApiError(400, "no such admin exists")
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400, "wrong password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(admin._id);

    const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken");


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInUser, accessToken, refreshToken
                },
                "Admin logged In Successfully"
            )
        )

})

const LogoutAdmin = asyncHandler( async(req, res)=>{
    //TODO: logout admin
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
            //we will get new updated value in return response
        }
    )

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "admin logged Out"))
})

const editIncharge = asyncHandler( async(req, res)=>{
    const { newIncharge, password } = req.body;

    if([newIncharge, password].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "No feilds can be empty")
    }

    const response = await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $set: {
                incharge: newIncharge 
            }
        },
        {
            new: true
        }
    )
    return res.status(200).json(
        new ApiResponse(
            200, response, "successfully updated incharge"
        )
    )
})
export {
    RegisterAdmin,
    LogoutAdmin,
    LoginAdmin,
    editIncharge
}