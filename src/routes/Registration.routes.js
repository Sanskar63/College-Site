import { Router } from "express";
import { courseRegistration, getAllRegistrationForms, getRegistrationForm, hostelRegistration, verifyRegistration } from "../controllers/Registration.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
const router = Router();

router.route("/course-registration").post(
    upload.fields([
        {
            name: 'courseFile',
            maxCount: 1
        }
    ]),
    verifyJWT,
    courseRegistration);
router.route("/hostel-registration").post(
    upload.fields([
        {
            name: 'hostelFile',
            maxCount: 1
        }
    ]),
    verifyJWT,
    hostelRegistration);
router.route("/verify").post(verifyJWT, verifyRegistration);
router.route("/getAllForms").get(verifyJWT, getAllRegistrationForms);
router.route("/getRegistrationForm/:id").get(verifyJWT, getRegistrationForm);

export default router;