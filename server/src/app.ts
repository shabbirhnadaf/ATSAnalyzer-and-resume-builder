import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import scanRoutes from "./routes/scan.routes";
import profileRoutes from "./routes/profile.routes";
import aiRoutes from "./routes/ai.routes";

import notFound from "./middleware/notFound.middleware";
import errorHandler from "./middleware/error.middleware";

const app = express();

// ✅ CORS
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "https://your-frontend.vercel.app" // 🔥 replace with real URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Security
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use("/api/", limiter);

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

export default app;