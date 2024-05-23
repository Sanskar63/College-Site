import { Router } from "express";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js"
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { GetHostelInfo, enterOrUpdateHostelInfo } from "../controllers/hostelInfo.controller.js";
const router = Router();

router.route("/hostelInfo").post(verifyJWT, enterOrUpdateHostelInfo)
router.route("/getHostelInformation/:id").get(verifyJWT, GetHostelInfo);
export default router;