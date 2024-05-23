import { Router } from "express";
import { editComplaint, getComplaints, getMyComplaints, writeComplaint } from "../controllers/Complaint.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.route("/getComplaints").get(verifyJWT, getComplaints); 
router.route("/getMyComplaints").get(verifyJWT, getMyComplaints);
router.route("/write").post(verifyJWT, writeComplaint);
router.route("/statusControl").post(verifyJWT, editComplaint); 

export default router;