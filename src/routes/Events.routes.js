import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { deleteOneEvent, getAllEvent, getOneEvent, writeEvent } from "../controllers/Events.controller.js";
const router = Router();

router.route("/getAll").get(getAllEvent);
router.route("/get/:id").get(getOneEvent);
router.route("/delete/:id").delete(verifyJWT, deleteOneEvent);
router.route("/write").post(verifyJWT,
    upload.fields([
    {
        name: 'image',
        maxCount: 1
    }
]), writeEvent);

export default router;