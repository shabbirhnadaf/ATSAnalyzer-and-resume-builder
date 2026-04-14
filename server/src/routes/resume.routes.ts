import { Router } from 'express';
import { resumeSchema } from '../schemas/resume.schema';
import { validate } from '../middleware/validate.middleware';
import authMiddleware from '../middleware/auth.middleware';
import {
  createResume,
  deleteResume,
  duplicateResume,
  updateResume,
  getResumes,
  getResumeById,
} from '../controllers/resume.controller';

const router = Router();

router.use(authMiddleware);
router.post('/', validate(resumeSchema), createResume);
router.get('/', getResumes);
router.post('/:id/duplicate', duplicateResume);
router.get('/:id', getResumeById);
router.put('/:id', validate(resumeSchema), updateResume);
router.delete('/:id', deleteResume);

export default router;