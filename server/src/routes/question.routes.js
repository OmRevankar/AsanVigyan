import { Router } from "express";
import { adminJWT } from "../middelwares/auth.middlewares.js";
import { upload } from "../middelwares/multer.middlewares.js";
import { createQuestion, deleteQuestion, fetchAllQuestions, fetchQuestion, updateQuestion } from "../controllers/question.controllers.js";

const router = Router();

router.route('/create').post(adminJWT,upload.single("questionImage"),createQuestion);
router.route('/update').patch(adminJWT , upload.single("questionImage"), updateQuestion);
router.route('/delete').delete(adminJWT,deleteQuestion);
router.route('/fetch').post(adminJWT,fetchQuestion);
router.route('/fetch-all').get(adminJWT,fetchAllQuestions);

export default router;