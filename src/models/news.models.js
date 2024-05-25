import { Schema, model } from "mongoose";

const NewsSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    img: {
        type: String, //Cloudinary Url
    },
    heading: {
        type: String
    },
    content: {
        type: String
    }
})

export const News = model("News", NewsSchema);