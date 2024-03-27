import { Schema, model } from "mongoose";

const hostelInfoSchema = new Schema({
    student:{
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    room:{
        type: String,
        required: true
    },
    bed:{
        type: String,
        required: true
    },
    hostel:{
        type: String,
        required: true
    }
});

export const HostelInfo = model("HostelInfo", hostelInfoSchema)