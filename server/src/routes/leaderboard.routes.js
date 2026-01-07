import { Router } from "express";
import { adminJWT, verifyJWT } from "../middelwares/auth.middlewares.js";
import { highScore, totalAttempts, totalScore } from "../controllers/leaderboard.controllers.js";

const router = Router();

router.route('/high-score').get(verifyJWT,highScore);
router.route('/total-score').get(verifyJWT,totalScore);
router.route('/total-attempts').get(verifyJWT,totalAttempts);

router.route('/high-score-ad').get(adminJWT,highScore);
router.route('/total-score-ad').get(adminJWT,totalScore);
router.route('/total-attempts-ad').get(adminJWT,totalAttempts);

export default router;