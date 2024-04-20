import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";


dotenv.config({
    path: '../.env'
})


const connectDB = async ()=>{
    try {
        console.log(process.env.MONGODB_URI)
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`MONGODB connection successfull HOST--- ${connect.connection.host}`);
    } catch (error) {
        console.log(`coudn't connect to mongodb`);
        process.exit(1);
    }
}

export default connectDB;