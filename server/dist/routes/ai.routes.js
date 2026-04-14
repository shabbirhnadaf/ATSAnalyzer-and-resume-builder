"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const ai_schema_1 = require("../schemas/ai.schema");
const router = (0, express_1.Router)();
router.post('/improve-summary', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.improveSummarySchema), ai_controller_1.improveSummaryController);
router.post('/improve-experience', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.improveExperienceSchema), ai_controller_1.improveExperienceController);
router.post('/generate-project', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.generateProjectSchema), ai_controller_1.generateProjectController);
router.post('/tailor-resume', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.tailorResumeSchema), ai_controller_1.tailorResumeController);
router.post('/build-resume', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.buildResumeSchema), ai_controller_1.buildResumeController);
router.post('/ats-analysis', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.atsAnalysisSchema), ai_controller_1.atsAnalysisController);
router.post('/skill-gap', auth_middleware_1.default, (0, validate_middleware_1.validate)(ai_schema_1.skillGapSchema), ai_controller_1.skillGapController);
exports.default = router;
