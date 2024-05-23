import { Schema, model } from "mongoose";

const registrationSchema = new Schema({
    courseStatus: {
        type: Boolean, //will be set by admin of course department
        default: false
    },
    hostelStatus: {
        type: Boolean, //will be set by admin of hostel department
        default: false
    },
    courseProof:{
        type: String, //cloudinary url
    },
    hostelProof:{
        type: String, //cloudinary url
    },
    currentSem:{
        type: Number,
    },
    student:{
        type: Schema.Types.ObjectId,
        ref: "Student"
    }
})

export const Registration = model("Registration", registrationSchema);