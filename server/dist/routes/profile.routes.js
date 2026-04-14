"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const profile_schema_1 = require("../schemas/profile.schema");
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.get('/', profile_controller_1.getProfile);
router.put('/', (0, validate_middleware_1.validate)(profile_schema_1.updateProfileSchema), profile_controller_1.updateProfile);
router.put('/password', (0, validate_middleware_1.validate)(profile_schema_1.changePasswordSchema), profile_controller_1.changePassword);
exports.default = router;
