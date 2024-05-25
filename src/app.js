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
import ApplicationRouter from "./routes/Application.routes.js"
import AdminRouter from "./routes/Admin.routes.js"
import Complaints from "./routes/Complaint.routes.js"
import Registration from "./routes/Registration.routes.js"
import Hostel from "./routes/HostelInfo.routes.js"
import News from "./routes/News.routes.js"
import Events from "./routes/Events.routes.js"

app.use("/api/v1/regis", RegisterStudentRouter);
app.use("/api/v1/application", ApplicationRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/complaint", Complaints);
app.use("/api/v1/registration", Registration);
app.use("/api/v1/hostel", Hostel);
app.use("/api/v1/news", News);
app.use("/api/v1/events", Events);



export {app};