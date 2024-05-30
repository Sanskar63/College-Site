import { Schema, model } from "mongoose";

const announcementSchema = new Schema({
    content:{
        type: String,
        required: true
    }
},{timestamps: true})

export const Announcement = model("Announcement", announcementSchema);