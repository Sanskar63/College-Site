import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Student } from "../models/students.model.js"; 

const RegisterStudent = asyncHandler( async (req, res)=>{
    const {fullName, email, password, rollno} = req.body;
    console.log(req.body);
    return res.send("ok good")
})

const LoginStudent = asyncHandler( async (req, res)=>{
    const name = req.body.name;
    console.log(name);
    return res.send("ok done")
})

const EditDetails = asyncHandler( async (req, res)=>{
    const name = req.body.name;
    console.log(name);
    return res.send("ok done")
})

export {
    RegisterStudent,
    LoginStudent,
    EditDetails
}