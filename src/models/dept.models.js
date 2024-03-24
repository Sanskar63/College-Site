import { Schema, model } from "mongoose";

const departmentsSchema = new Schema({
    dept_name:{
        type: String,
        required: true
    },
    incharge: {
        type: String,
        required: true
    }
})

export const Department = model("Department", departmentsSchema);