import { Router } from "express";
import { EditDetails, LoginStudent, RegisterStudent } from "../db/controllers/RegisStu.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'image',
            maxCount: 1
        },
        {
            name: 'gradeCard',
            maxCount: 8
        }
    ])
    ,RegisterStudent);
    
router.route("/login").post(LoginStudent);
router.route("/edit").post(EditDetails);


export default router;