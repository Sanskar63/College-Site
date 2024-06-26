import { Router } from "express";
import { editApplication, getApplications, getMyApplications, writeApplication } from "../controllers/Application.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
const router = Router();

router.route("/getApplications").get(verifyJWT, getApplications); //add admin authentication middleware
router.route("/getMyApplications").get(verifyJWT, getMyApplications);
router.route("/write").post(verifyJWT, writeApplication);
router.route("/statusControl").post(verifyJWT, editApplication); //add admin authentication middleware

export default router;