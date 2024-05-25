import mongoose from "mongoose";
import { News } from "../models/news.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllNews = asyncHandler(async (req, res) => {
    const allNews = await News.find();
    if (!allNews) {
        throw new ApiError(400, "Unable to fetch All News from Controller")
    }

    return res.status(200).json(
        new ApiResponse(200, allNews, "News Fetched Successfully")
    )
})

const getOneNews = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const aNews = await News.findById(id);
    if (!aNews) {
        throw new ApiError(400, "Unable to fetch News by id from Controller")
    }

    return res.status(200).json(
        new ApiResponse(200, aNews, "News Fetched Successfully")
    )
})

const writeNews = asyncHandler(async (req, res) => {
    const { heading, content, date } = req.body;

    if ([heading, content, date].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }

    if (req.files.image) {
        const imageLocalPath = req.files?.image[0]?.path;
        const image = await uploadOnCloudinary(imageLocalPath);
        if (!image) {

            throw new ApiError(500, "coudn't upload on cloudinary")
        }
        // console.log(image);

        const news = await News.create({
            heading, content, date, img: image.url
        })

        if (!news) {
            throw new ApiError(500, "coudn't add news")
        }
        return res.status(200).json(
            new ApiResponse(
                200, { news }, "successfully added the news"
            )
        )
    }


    const news = await News.create({
        heading, content, date
    })

    if (!news) {
        throw new ApiError(500, "coudn't add news")
    }
    return res.status(200).json(
        new ApiResponse(
            200, { news }, "successfully added the news"
        )
    )


})

const deleteOneNews = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const response = await News.findByIdAndDelete(id);

    if (!response) {
        throw new ApiError(500, "coudn't find news ")
    }
    return res.status(200).json(
        new ApiResponse(
            200, { response }, "deleted news successfully"
        )
    )
})

export {
    getAllNews,
    getOneNews,
    deleteOneNews,
    writeNews
}