import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaints.models.js";
import { Student } from "../models/students.model.js";
import { Admin } from "../models/admin.models.js";
import mongoose from "mongoose";

const getComplaints = asyncHandler( async(req, res)=>{
    //TODO: get show the applications
    const allComplaints = await Admin.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.admin._id)
            }
        },
        {
            $lookup:{
                from:"complaints",
                localField: "_id",
                foreignField:"to",
                as: "Complaints"
            }
        },
        {
            $project:{
                _id:1,
                Complaints: "$Complaints"
            }
        }
    ])

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allComplaints[0],
            "Complaints fetched successfully"
        )
    )
})

const writeComplaint = asyncHandler( async(req, res)=>{
    //TODO: writer application and save in db
    //get content , to, passsword 
    //to will be department name of department schema
    //check whether password is correct
    //create application db
    
    const { content, to, password } = req.body;

    if([content, to, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "No field can be empty")
    }
    const student = await Student.findById(req.student._id)
    // console.log(student)
    const isPasswordCorrect = await student.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400, "invalid password")
    }

    const admin = await Admin.findOne({dept_name : to});
    if(!admin){
        throw new ApiError(400, "Invalid Department name");
    }
    // console.log(dept);
    const complaint = await Complaint.create({
        content,
        to:admin._id,
        writtenBy: student._id
    })

    return res.status(200).json(
        new ApiResponse(200, complaint, "Complaint sent successfully")
    )
})

const editComplaint = asyncHandler( async(req, res)=>{
    //TODO: make functionality for setting the status of application
    const { complaintId, status} = req.body;
    const admin = await Admin.findById(req.admin._id);
    if(!admin){
        throw new ApiError(400, "Unauthorised Access")
    }

    const complaint = await Complaint.findByIdAndUpdate(
        new mongoose.Types.ObjectId(complaintId),
        {
            $set: { status }
        },{
            new: true
        });


    if(!complaint){
        throw new ApiError(400, "No such complaints Exists")
    }

    return res.status(200).json(
        new ApiResponse(
            200, complaint, "status updated successfully"
        )
    )
})

const getMyComplaints = asyncHandler( async(req, res)=>{
    //TODO: show application written by our student
    const student = await Student.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.student._id)
            }
        },
        {
            $lookup:{
                from:"complaints",
                localField: "_id",
                foreignField:"writtenBy",
                as: "myComplaints"
            }
        },
        {
            $project:{
                _id:1,
                myComplaints: "$myComplaints"
            }
        }
    ])

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            student[0],
            "Complaints fetched successfully"
        )
    )
})

export {
    editComplaint,
    getComplaints,
    writeComplaint,
    getMyComplaints
}