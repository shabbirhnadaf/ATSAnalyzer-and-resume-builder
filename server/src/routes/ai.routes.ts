import { Router } from 'express';
import {
  atsAnalysisController,
  buildResumeController,
  generateProjectController,
  improveExperienceController,
  improveSummaryController,
  skillGapController,
  tailorResumeController,
} from '../controllers/ai.controller';
import authMiddleware from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  atsAnalysisSchema,
  buildResumeSchema,
  generateProjectSchema,
  improveExperienceSchema,
  improveSummarySchema,
  skillGapSchema,
  tailorResumeSchema,
} from '../schemas/ai.schema';

const router = Router();

router.post(
  '/improve-summary',
  authMiddleware,
  validate(improveSummarySchema),
  improveSummaryController
);

router.post(
  '/improve-experience',
  authMiddleware,
  validate(improveExperienceSchema),
  improveExperienceController
);

router.post(
  '/generate-project',
  authMiddleware,
  validate(generateProjectSchema),
  generateProjectController
);

router.post(
  '/tailor-resume',
  authMiddleware,
  validate(tailorResumeSchema),
  tailorResumeController
);

router.post(
  '/build-resume',
  authMiddleware,
  validate(buildResumeSchema),
  buildResumeController
);

router.post(
  '/ats-analysis',
  authMiddleware,
  validate(atsAnalysisSchema),
  atsAnalysisController
);

router.post(
  '/skill-gap',
  authMiddleware,
  validate(skillGapSchema),
  skillGapController
);

export default router;