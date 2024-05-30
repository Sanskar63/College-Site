import { Announcement } from "../models/announcements.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAnnouncements = asyncHandler( async(req, res)=>{
    const allAnnouncements = await Announcement.find();
    if(!allAnnouncements){
        throw new ApiError(400, "problem in fetching Announcements")
    }

    return res.status(200).json(
        new ApiResponse(
            200, allAnnouncements, "Announcements fetched successfully"
        )
    )
});

const writeAnnouncement = asyncHandler( async(req, res)=>{
    const { content } = req.body;
    if(!content){
        throw new ApiError(400, "Content can't be empty")
    }
    const response = await Announcement.create(
        { content }
    )
    return res.status(200).json(
        new ApiResponse(200, response, "Announcement created successfully")
    )
});

export {
    getAnnouncements,
    writeAnnouncement
}