import { Router } from "express";
import { LoginAdmin, LogoutAdmin, RegisterAdmin, editIncharge } from "../controllers/RegisAdmin.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/register").post(RegisterAdmin);
router.route("/login").post(LoginAdmin);
router.route("/logout").post( verifyAdmin, LogoutAdmin);
router.route("/editIncharge").post( verifyAdmin, editIncharge);

export default router;