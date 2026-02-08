import { Router } from "express";
import { adminJWT, verifyJWT } from "../middelwares/auth.middlewares.js";
import { beginTest, fetchAll, fetchTest, fetchUserTestHistory, fetchUserTestHistoryAdmin, submitTest } from "../controllers/test.controllers.js";

const router = Router();

router.route('/start').post(verifyJWT,beginTest);

router.route('/submit').post(verifyJWT,submitTest);
router.route('/fetch').post(verifyJWT,fetchTest);
router.route('/fetch-user-test-history').get(verifyJWT,fetchUserTestHistory);


router.route('/fetch-ad').post(adminJWT,fetchTest);
router.route('/fetch-all').get(adminJWT,fetchAll);
router.route('/fetch-user-test-history-ad').post(adminJWT,fetchUserTestHistoryAdmin);

export default router;