import { Router } from "express";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js"
import { enterOrUpdateHostelInfo } from "../controllers/hostelInfo.controller.js";
const router = Router();

router.route("/hostelInfo").post(verifyAdmin, enterOrUpdateHostelInfo)
export default router;