import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/students.model.js";
import { Admin } from "../models/admin.models.js";
import { HOSTEL_DEPARTMENT } from "../constants.js";
import { HostelInfo } from "../models/hostelInfo.models.js";

const enterOrUpdateHostelInfo = asyncHandler( async(req, res)=>{
    const {room , bed, hostel, stuRollno}= req.body;

    if([room, bed, hostel].some((field)=>field?.trim ==="")){
        throw new ApiError(400, "no field can be empty")
    }

    const admin = await Admin.findById(req.user._id);
    if(admin.dept_name !== HOSTEL_DEPARTMENT){
        throw new ApiError(401, "Unauthorised Access")
    }

    const student = await Student.findOne({rollno : stuRollno});
    if(!student){
        throw new ApiError(400, "No student with this roll no exists")
    }

    const isPresent = await HostelInfo.findOne({student:student._id})
    if(isPresent){
        const hostelInfo = await HostelInfo.findByIdAndUpdate(
            isPresent._id,
            {
                room,
                bed,
                hostel
            },
            {new: true}
        );

        return res.status(200).json(
            new ApiResponse(200, hostelInfo,"Information updated")
        )
    }

    const hostelInfo = await HostelInfo.create({
        room,
        bed,
        hostel,
        student: student._id
    });

    return res.status(200).json(
        new ApiResponse(200, hostelInfo, "Created Hostel Information")
    )
})

const GetHostelInfo = asyncHandler( async(req, res) =>{
    const id = req.params.id;

    const student = await HostelInfo.findOne({student:id})

    if(!student){
        throw new ApiError(400, "No Hostel Information found")
    }

    return res.status(200).json(
        new ApiResponse(200, student, "Hostel information Fetched successfully")
    )
})

export { enterOrUpdateHostelInfo, GetHostelInfo };