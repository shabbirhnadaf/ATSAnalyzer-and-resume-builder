import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { changePasswordSchema, updateProfileSchema } from '../schemas/profile.schema';
import { changePassword, getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.put('/password', validate(changePasswordSchema), changePassword);

export default router;