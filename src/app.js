import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.static("public"));


//routes related work now
import RegisterStudentRouter from "./routes/RegisStu.router.js";

app.use("/regis", RegisterStudentRouter);



export {app};