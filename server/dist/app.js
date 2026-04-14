"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const scan_routes_1 = __importDefault(require("./routes/scan.routes"));
const notFound_middleware_1 = __importDefault(require("./middleware/notFound.middleware"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const app = (0, express_1.default)();
// accessible frontends
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    // 'https://resume-builder-frontend.vercel.app'
];
app.use((0, cors_1.default)({ origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('not allowed by cors'));
        }
    },
    credentials: true }));
// security middleware
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use('/api/', limiter);
// routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/resumes', resume_routes_1.default);
app.use('/api/scans', scan_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
// Error handler
app.use(notFound_middleware_1.default);
app.use(error_middleware_1.default);
exports.default = app;
