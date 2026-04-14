"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_middleware_1.validate)(auth_schema_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validate_middleware_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_middleware_1.default, auth_controller_1.me);
exports.default = router;
