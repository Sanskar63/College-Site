import { Router } from "express";
import { editComplaint, getComplaints, getMyComplaints, writeComplaint } from "../controllers/Complaint.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/getComplaints").get(verifyAdmin, getComplaints); //add admin authentication middleware
router.route("/getMyComplaints").get(verifyJWT, getMyComplaints);
router.route("/write").post(verifyJWT, writeComplaint);
router.route("/statusControl").post(verifyAdmin, editComplaint); //add admin authentication middleware

export default router;