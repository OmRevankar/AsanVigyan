import { Router } from "express";
import { verifyJWT } from "../middelwares/auth.middlewares.js";
import { beginTest, fetchAll, fetchTest, fetchUserTestHistory, submitTest } from "../controllers/test.controllers.js";

const router = Router();

router.route('/start').get(verifyJWT,beginTest);
router.route('/submit').post(verifyJWT,submitTest);
router.route('/fetch').get(verifyJWT,fetchTest);
router.route('/fetch-all').get(verifyJWT,fetchAll);
router.route('/fetch-user-test-history').get(verifyJWT,fetchUserTestHistory);

export default router;