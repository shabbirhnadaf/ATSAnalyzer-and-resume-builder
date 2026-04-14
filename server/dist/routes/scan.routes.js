"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const scan_controller_1 = require("../controllers/scan.controller");
const scan_schema_1 = require("../schemas/scan.schema");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post('/', (0, validate_middleware_1.validate)(scan_schema_1.scanSchema), scan_controller_1.scanResume);
router.get('/history', scan_controller_1.getScanHistory);
router.get('/resume/:resumeId', scan_controller_1.getScanHistory);
exports.default = router;
