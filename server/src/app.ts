import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from './routes/resume.routes';
import scanRoutes from './routes/scan.routes';
import notFound from "./middleware/notFound.middleware";
import errorHandler from "./middleware/error.middleware"; 
import profileRoutes from './routes/profile.routes';
import aiRoutes from './routes/ai.routes'

const app = express();

// accessible frontends
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    // 'https://resume-builder-frontend.vercel.app'
]
app.use(cors({origin: function(origin, callback) {
    if(!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('not allowed by cors'));
        }
    },
    credentials: true}
));

// security middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true}));

// rate limiting
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 200
})
app.use('/api/', limiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);

// health check
app.get('/api/health', (req, res) => res.json({ status: 'OK'}));

// Error handler
app.use(notFound);
app.use(errorHandler);

export default app;