import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { getScanHistory, scanResume } from "../controllers/scan.controller";
import { scanSchema } from "../schemas/scan.schema";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.post('/', validate(scanSchema), scanResume);
router.get('/history', getScanHistory);
router.get('/resume/:resumeId', getScanHistory);

export default router;