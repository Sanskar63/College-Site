import { Schema, model } from "mongoose";

const EventSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    img:
        { type: String, } //Cloudinary Url
    ,
    heading: {
        type: String
    },
    content: {
        type: String
    }
})

export const Event = model("Event", EventSchema);