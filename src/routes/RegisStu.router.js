import { Router } from "express";
import { GetStudent, LoginStudent, LogoutStudent, RegisterStudent, changePassword } from "../controllers/RegisStu.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'image',
            maxCount: 1
        },
        {
            name: 'gradeCards',
            maxCount: 8
        }
    ])
    ,RegisterStudent);
    
router.route("/login").post(LoginStudent);
router.route("/logout").post(verifyJWT, LogoutStudent);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/getStudent/:id").get(verifyJWT, GetStudent);


export default router;