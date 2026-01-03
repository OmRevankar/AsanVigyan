import { Router } from "express";
import { upload } from "../middelwares/multer.middlewares";
import { createAdmin, fetchAdmin, loginAdmin, logoutAdmin, updateAdmin } from "../controllers/admin.controllers";
import { adminJWT } from "../middelwares/auth.middlewares";

const router = Router();

router.route('/create').post(upload.single("profileImage"),createAdmin);
router.route('/login').post(loginAdmin);
router.route('/logout').post(adminJWT,logoutAdmin);
router.route('/update').patch(adminJWT,upload.single("profileImage"),updateAdmin);
router.route('/fetch').get(adminJWT,fetchAdmin);

export default router;