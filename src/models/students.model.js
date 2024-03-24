import {Schema, model} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const studentSchema = new Schema({
    fullName:{
        type: String,
        required: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    rollno:{
        type: Number,
        required: true,
        index: true
    },
    image: {
        type: String, // cloudinary url
        // required: true,
    },
    currentSem:{
        type: Number,
        required: true,
    },
    gradeCards:[
        {
            type: String, //cloudinary url
        }
    ],
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//do not do this function as async function else it would return promise
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student = model("Student", studentSchema);