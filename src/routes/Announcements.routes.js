import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { getAnnouncements, writeAnnouncement } from "../controllers/Announcement.controller.js";

const router = Router();

router.route("/get").get(getAnnouncements);
router.route("/write").post(verifyJWT, writeAnnouncement);

export default router;