import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Student } from "../models/students.model.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await Student.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken //we save refresh token in our db and give access token to the user. 
        await user.save({ validateBeforeSave: false })//on saving all the code will be fired and mongoose will give errror because there a some feilds that are required like password thus  we have set validation to false.

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const RegisterStudent = asyncHandler( async (req, res)=>{
    //obtain data and check if its is empty
    //check if student already exists
    //obtain image from multer
    //upload image on cloudinary
    //check if upload successfull
    //create the student

    const {fullName, email, password, rollno} = req.body;

    if ([fullName, email, password].some((field) =>field?.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }

    const isPresent = await Student.findOne({email});

    if(isPresent){
        throw new ApiError(400, "Student alread exists")
    }
    
    const imageLocalPath = req.files?.image[0]?.path;

    if(!imageLocalPath){
        throw new ApiError(400, "image is required")
    }

    const imagee = await uploadOnCloudinary(imageLocalPath)

    if(!imagee){
        throw new ApiError(500, "coudn't upload on cloudinary")
    }

    let student = await Student.create({
        fullName,
        email,
        rollno,
        password,
        image: imagee.url,
        currentSem: 4,
        // gradeCards: grade.url
    })

    const response = student.toObject();
    if(!response){
        throw new ApiError(500, "coudn't add student")
    }
    delete response.password;
    

    return res.status(200).json(
        new ApiResponse(
            200, {response}, "successfully added the student"
        )
    )
})

const LoginStudent = asyncHandler( async (req, res)=>{
    //get the email and password
    //check if email and password is empty
    //check db for email 
    //compare the password 
    //generate access and refresh token 
    //

    const {email, password} = req.body;
    
    if(!email || !password){
        throw new ApiError(400, "no feild can be empty")
    }

    const student = await Student.findOne({email});
    //here i had done .select("-password -refreshToken") and then it was giving me error when i tried to use isPasswordCorrect on user. so Don't remove the entity that is needed ahead.
    if(!student){
        throw new ApiError(400, "no such student exists")
    }

    const isPasswordValid = await student.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, "incorrect password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(student._id);

    const loggedInUser = await Student.findById(student._id).select("-password -refreshToken");


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
                    student: loggedInUser, accessToken, refreshToken
                },
                "Student logged In Successfully"
            )
        )
})

const changePassword = asyncHandler( async (req, res)=>{
    const {oldPassword, newPassword} = req.body;
    
    const student = await Student.findById(req.user._id);

    const isPasswordCorrect = await student.isPasswordCorrect(oldPassword);

   
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    student.password = newPassword
    await student.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "password updated successfully")
    )

})

const LogoutStudent = asyncHandler ( async (req, res)=> {
    await Student.findByIdAndUpdate(
        req.user._id,
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

    const options = {
        httpOnly: true,
        secure: true
        //by default anyone (frontend and backend) can modify cookies but after adding this it can only be modified by backend sever.
    }


    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "student logged Out"))
})

const GetStudent = asyncHandler (async (req, res)=>{
    const id = req.params.id;
    const student = await Student.findById(id).select("-password -refreshToken");
    if(!student){
        throw new ApiError(400, "No student of such id Exists");
    }

    return res.status(200).json(
        new ApiResponse(
            200, student, "Student details sent successfully"
        )
    )
})
export {
    RegisterStudent,
    LoginStudent,
    changePassword,
    LogoutStudent,
    GetStudent
}