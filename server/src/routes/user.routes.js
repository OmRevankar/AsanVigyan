import { Router } from "express";
import { fetchOtherUser, fetchUser, loginUser, logoutUser, registerUser, updateUser} from "../controllers/user.controllers.js";
import { upload } from "../middelwares/multer.middlewares.js";
import { adminJWT, verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

router.route('/register').post(upload.single("profileImage"),registerUser);
router.route('/login').post(loginUser);
router.route('/update').patch(verifyJWT,upload.single("profileImage"),updateUser);
router.route('/fetch').get(verifyJWT,fetchUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/fetch-other-user').post(verifyJWT,fetchOtherUser);


router.route('/fetch-user-a').post(adminJWT,fetchOtherUser);

export default router