import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
    writtenBy:{
        type: Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending' // Default value can be one of the allowed enum values
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        required: true
    }

},{timestamps: true})

export const Application = model("Application", applicationSchema);
