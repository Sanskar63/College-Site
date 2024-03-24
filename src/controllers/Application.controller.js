import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from "../models/application.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getApplications = asyncHandler( async(req, res)=>{
    //TODO: get show the applications
    res.send("ok done");
})

const writeApplication = asyncHandler( async(req, res)=>{
    //TODO: writer application and save in db
    res.send("ok done");
})

const editApplication = asyncHandler( async(req, res)=>{
    //TODO: make functionality for setting the status of application
    res.send("ok done");
})

const getMyApplications = asyncHandler( async(req, res)=>{
    //TODO: show application written by our student
    res.send("ok done");
})

export {
    getApplications,
    getMyApplications,
    writeApplication,
    editApplication
}