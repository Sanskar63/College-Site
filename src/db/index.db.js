import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB connection successfull HOST--- ${connect.connection.host}`);
    } catch (error) {
        console.log(`coudn't connect to mongodb`);
        process.exit(1);
    }
}

export default connectDB;