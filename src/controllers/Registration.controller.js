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
    console.log("details --------->", currentSem, password);

    const student = await Student.findById(req.user._id);
    const isPasswordCorrect = await student.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Unauthorised access")
    }

    const courseProofLocalPath = req.files?.courseFile[0].path;
    console.log("file---------->", courseProofLocalPath)
    if (!courseProofLocalPath) {
        throw new ApiError(400, "course Proof is required")
    }

    const courseProof = await uploadOnCloudinary(courseProofLocalPath);
    if (!courseProof) {
        throw new ApiError(500, "Couldn't upload on cloudinary")
    }

    const isAlreadyPresent = await Registration.findOneAndUpdate(
        { student: req.user._id },
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
        student: req.user._id
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

    const student = await Student.findById(req.user._id);
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
        { student: req.user._id },
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
        student: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(
            200, hostel, "document created successfully"
        )
    )

})

const getAllRegistrationForms = asyncHandler( async (req, res)=>{3
    //verify if authorised admin is accessing the information
    //group all registration documents and give

    const admin = await Admin.findById(req.user._id);
    if(admin.dept_name !== REGISTRATION_DEPARTMENT){
        throw new ApiError(200, "Unauthorised Request to data access")
    }

    const allForms = await Registration.aggregate([
        {
          $group: {
            _id: null,
            forms: { $push: "$$ROOT" }, // Push all documents into an array
            //The $push operator accumulates all the documents into an array called forms.
            //In MongoDB's aggregation framework, $$ROOT is a system variable that references the root document being processed in the aggregation pipeline. It represents the entire document that is currently being processed at that stage of the pipeline.

            //When you use $$ROOT within an aggregation stage, it captures the entire document being processed and allows you to reference all of its fields and values.
            total: { $sum: 1 }, // Count the total number of documents
          }
        },
        {
          $project: {
            _id: 0, // Exclude _id field from the result
            forms: 1, // Include the forms array in the result
            total: 1 // Include the total count in the result
          }
        }
      ]);
      
    if(!allForms){
        return res.status(200).json(
            new ApiResponse(200, {}, "No forms available")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, allForms, "forms fetched successfully")
    )
})

const verifyRegistration = asyncHandler(async (req, res) => {
    // take input from admin for courseStatus, hostelStatus, registration_id
    //find the document and update the status

    const { courseStatus, hostelStatus, registrationId } = req.body;
    // console.log("----->",req.body)
    const department = await Admin.findById(req.user._id);

    const dept_name = department.dept_name;

    if(dept_name !== REGISTRATION_DEPARTMENT){
        throw new ApiError(400, "Unauthorised Department")
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

const getRegistrationForm = asyncHandler( async(req, res)=>{
    const id = req.params.id;

    const student = await Registration.findOne({student:id}).select("-password -accessToken");

    if(!student){
        throw new ApiError(400, "student don't have any registration for current semester or hostel")
    }

    return res.status(200).json(
        new ApiResponse(
            200, student, "fetched info successfully"
        )
    )
})

export {
    courseRegistration,
    hostelRegistration,
    verifyRegistration,
    getAllRegistrationForms,
    getRegistrationForm
}