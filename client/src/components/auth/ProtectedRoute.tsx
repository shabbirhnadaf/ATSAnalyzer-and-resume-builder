import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    const loaction = useLocation();

    if(loading) {
        return <div className="grid min-h-min place-items-center text-white">Loading...</div>
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: loaction }} />;
    }

    return <Outlet />;
} 