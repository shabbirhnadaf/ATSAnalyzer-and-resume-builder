"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_schema_1 = require("../schemas/resume.schema");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const resume_controller_1 = require("../controllers/resume.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post('/', (0, validate_middleware_1.validate)(resume_schema_1.resumeSchema), resume_controller_1.createResume);
router.get('/', resume_controller_1.getResumes);
router.post('/:id/duplicate', resume_controller_1.duplicateResume);
router.get('/:id', resume_controller_1.getResumeById);
router.put('/:id', (0, validate_middleware_1.validate)(resume_schema_1.resumeSchema), resume_controller_1.updateResume);
router.delete('/:id', resume_controller_1.deleteResume);
exports.default = router;
