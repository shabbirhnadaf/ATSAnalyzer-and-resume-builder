import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Builder from "../pages/Builder";
import ATSScannerPage from "../pages/ATSScannerPage";
import Templates from "../pages/Templates";
import Blogs from "../pages/Blogs";
import Resumes from "../pages/Resumes";
import ScanHistoryPage from "../pages/ScanHistory";
import NotFound from "../pages/NotFound";
import AppShell from "../components/layout/AppShell";
import ResumePreviewPage from "../pages/ResumePreviewPage";
import ProfileSettings from "../pages/ProfileSettings";
import AIAssistant from "../pages/AIAssistant";
import AIResumeBuilder from "../pages/AIResumeBuilder";
import AIATSAnalysis from "../pages/AIATSAnalysis";

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/templates', element: <Templates /> },
  { path: '/blogs', element: <Blogs /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/builder', element: <Builder /> },
          { path: '/ats-scanner', element: <ATSScannerPage /> },
          { path: '/resumes', element: <Resumes /> },
          { path: '/scan-history', element: <ScanHistoryPage /> },
          { path: '/resume-preview/:id', element: <ResumePreviewPage /> },
          { path: '/settings', element: <ProfileSettings /> },
          { path: '/ai-assistant', element: <AIAssistant /> },
          { path: '/ai-resume-builder', element: <AIResumeBuilder /> },
          { path: '/ai-ats-analysis', element: <AIATSAnalysis /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);