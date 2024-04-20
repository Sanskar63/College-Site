import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from "../models/application.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/students.model.js";
import { Admin } from "../models/admin.models.js";
import mongoose from "mongoose";

const getApplications = asyncHandler( async(req, res)=>{
    //TODO: get show the applications
    const allApplications = await Admin.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"applications",
                localField: "_id",
                foreignField:"to",
                as: "Applications"
            }
        },
        {
            $project:{
                _id:1,
                Applications: "$Applications"
            }
        }
    ])

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allApplications[0],
            "Application fetched successfully"
        )
    )
})

const writeApplication = asyncHandler( async(req, res)=>{
    //TODO: writer application and save in db
    //get content , to, passsword 
    //to will be department name of department schema
    //check whether password is correct
    //create application db
    
    const { content, to, password } = req.body;

    if([content, to, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "No field can be empty")
    }
    // console.log(req.user);
    const student = await Student.findById(req.user._id)
    console.log(student)
    const isPasswordCorrect = await student.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400, "invalid password")
    }

    const admin = await Admin.findOne({dept_name : to});
    if(!admin){
        throw new ApiError(400, "Invalid Department name");
    }
    // console.log(dept);
    const application = await Application.create({
        content,
        to:admin._id,
        writtenBy: student._id
    })

    return res.status(200).json(
        new ApiResponse(200, {application}, "Application sent successfully")
    )
})

const editApplication = asyncHandler( async(req, res)=>{
    //TODO: make functionality for setting the status of application
    const {applicationId, status} = req.body;
    const admin = await Admin.findById(req.user._id);
    if(!admin){
        throw new ApiError(400, "Unauthorised Access")
    }

    const application = await Application.findByIdAndUpdate(
        new mongoose.Types.ObjectId(applicationId),
        {
            $set: { status }
        },{
            new: true
        });

    if(!application){
        throw new ApiError(400, "No such application Exists")
    }

    return res.status(200).json(
        new ApiResponse(
            200, application, "status updated successfully"
        )
    )
})

const getMyApplications = asyncHandler( async(req, res)=>{
    //TODO: show application written by our student
    const student = await Student.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"applications",
                localField: "_id",
                foreignField:"writtenBy",
                as: "myApplications"
            }
        },
        {
            $project:{
                _id:1,
                myApplications: "$myApplications"
            }
        }
    ])

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            student[0],
            "Application fetched successfully"
        )
    )
})

export {
    getApplications,
    getMyApplications,
    writeApplication,
    editApplication
}