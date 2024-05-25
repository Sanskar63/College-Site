import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { deleteOneNews, getAllNews, getOneNews, writeNews } from "../controllers/News.controller.js";
const router = Router();

router.route("/getAll").get(getAllNews);
router.route("/get/:id").get(getOneNews);
router.route("/delete/:id").delete(verifyJWT, deleteOneNews);
router.route("/write").post(verifyJWT,
    upload.fields([
    {
        name: 'image',
        maxCount: 1
    }
]), writeNews);

export default router;