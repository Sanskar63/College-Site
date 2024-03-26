import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Registration } from "../models/registration.model.js"
import { Student } from "../models/students.model.js"
import { Admin } from "../models/admin.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { REGISTRATION_DEPARTMENT } from "../constants.js"
import mongoose from "mongoose"

const courseRegistration = asyncHandler(async (req, res) => {
    //accept courseProof and currentSem and password 
    //verify password
    //take courseProofLocalPath and upload it on cloudinary
    //verify if uploaded
    //check if already present db using student Id
    //if not present then create one else update

    const { currentSem, password } = req.body;
    if (!currentSem || !password) {
        throw new ApiError(400, "all fields are required")
    }

    const student = await Student.findById(req.student._id);
    const isPasswordCorrect = await student.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Unauthorised access")
    }

    const courseProofLocalPath = req.files?.courseFile[0].path;
    if (!courseProofLocalPath) {
        throw new ApiError(400, "course Proof is required")
    }

    const courseProof = await uploadOnCloudinary(courseProofLocalPath);
    if (!courseProof) {
        throw new ApiError(500, "Couldn't upload on cloudinary")
    }

    const isAlreadyPresent = await Registration.findOneAndUpdate(
        { student: req.student._id },
        {
            courseProof: courseProof.url,
            currentSem
        },
        { new: true }
    );

    if (isAlreadyPresent) {
        return res.status(200).json(
            new ApiResponse(
                200, isAlreadyPresent, "document updated successfully"
            )
        )
    }

    const course = await Registration.create({
        courseProof: courseProof.url,
        currentSem,
        student: req.student._id
    });

    return res.status(200).json(
        new ApiResponse(
            200, course, "document created successfully"
        )
    )

})

const hostelRegistration = asyncHandler(async (req, res) => {
    //accept hostelProof and currentSem and password 
    //verify password
    //take hostelProofLocalPath and upload it on cloudinary
    //verify if uploaded
    //check if already present db using student Id
    //if not present then create one else update

    const { password } = req.body;
    if (!password) {
        throw new ApiError(400, "password is required")
    }

    const student = await Student.findById(req.student._id);
    const isPasswordCorrect = await student.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Unauthorised access")
    }

    const hostelProofLocalPath = req.files?.hostelFile[0]?.path;
    if (!hostelProofLocalPath) {
        throw new ApiError(400, "hostel Proof is required")
    }

    const hostelProof = await uploadOnCloudinary(hostelProofLocalPath);
    if (!hostelProof) {
        throw new ApiError(500, "Couldn't upload on cloudinary")
    }

    const isAlreadyPresent = await Registration.findOneAndUpdate(
        { student: req.student._id },
        {
            hostelProof: hostelProof.url,
        },
        { new: true }
    );

    if (isAlreadyPresent) {
        return res.status(200).json(
            new ApiResponse(
                200, isAlreadyPresent, "document updated successfully"
            )
        )
    }

    const hostel = await Registration.create({
        hostelProof: hostelProof.url,
        student: req.student._id
    });

    return res.status(200).json(
        new ApiResponse(
            200, hostel, "document created successfully"
        )
    )

})

const verifyRegistration = asyncHandler(async (req, res) => {
    // take input from admin for courseStatus, hostelStatus, registration_id
    //find the document and update the status

    const { courseStatus, hostelStatus, registrationId } = req.body;

    const department = await Admin.findById(req.admin._id);

    const dept_name = department.dept_name;

    if(dept_name !== REGISTRATION_DEPARTMENT){
        throw new ApiError(400, "Unauthorised Access")
    }
    
    const registration = await Registration.findByIdAndUpdate(
        new mongoose.Types.ObjectId(registrationId),
        {
            courseStatus,
            hostelStatus
        },
        { new: true }
    );

    if (!registration) {
        throw new ApiError(200, "No such document exists");
    }

    return res.status(200).json(
        new ApiResponse(
            200, registration, "status updated successfully"
        )
    )

})

export {
    courseRegistration,
    hostelRegistration,
    verifyRegistration
}