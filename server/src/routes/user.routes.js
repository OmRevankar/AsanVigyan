import { Router } from "express";
import { fetchUser, loginUser, logoutUser, registerUser, updateUser} from "../controllers/user.controllers.js";
import { upload } from "../middelwares/multer.middlewares.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

router.route('/register').post(upload.single("profileImage"),registerUser);
router.route('/login').post(loginUser);
router.route('/update').patch(verifyJWT,upload.single("profileImage"),updateUser);
router.route('/fetch').get(verifyJWT,fetchUser);
router.route('/logout').post(verifyJWT,logoutUser);

export default router