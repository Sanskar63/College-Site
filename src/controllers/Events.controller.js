import { Event } from "../models/events.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllEvent = asyncHandler( async(req, res)=>{
    const allEvent = await Event.find();
    if(!allEvent){
        throw new ApiError(400, "Unable to fetch All Event from Controller")
    }

    return res.status(200).json(
        new ApiResponse(200, allEvent, "Event Fetched Successfully")
    )
})

const getOneEvent = asyncHandler( async(req, res)=>{
    const id = req.params.id;
    const aEvent = await Event.findById(id);
    if(!aEvent){
        throw new ApiError(400, "Unable to fetch Event by id from Controller")
    }

    return res.status(200).json(
        new ApiResponse(200, aEvent, "Event Fetched Successfully")
    )
})

const writeEvent = asyncHandler( async(req, res)=>{
    const { heading, content, date } = req.body;

    if ([heading, content, date].some((field) =>field?.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }

    if(req.files.image){
        const imageLocalPath = req.files?.image[0]?.path;
        const image = await uploadOnCloudinary(imageLocalPath);
        if(!image){
            
            throw new ApiError(500, "coudn't upload on cloudinary")
        }
        const event = await Event.create({
            heading, content , date, img: image.url
        })

        if(!event){
            throw new ApiError(500, "coudn't add event")
        }

        return res.status(200).json(
            new ApiResponse(
                200, {event}, "successfully added the event"
            )
        )
    }

    const event = await Event.create({
        heading, content , date
    })

    if(!event){
        throw new ApiError(500, "coudn't add event")
    }
    return res.status(200).json(
        new ApiResponse(
            200, {event}, "successfully added the event"
        )
    )
})

const deleteOneEvent = asyncHandler( async(req, res)=>{
    const { id } = req.params;

    const response = await Event.findByIdAndDelete(id);
    
    if(!response){
        throw new ApiError(500, "coudn't find event ")
    }
    return res.status(200).json(
        new ApiResponse(
            200, {response}, "deleted event successfully"
        )
    )
})

export {
    getAllEvent,
    getOneEvent,
    deleteOneEvent,
    writeEvent
}