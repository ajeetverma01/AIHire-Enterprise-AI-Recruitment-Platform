import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {

    const { user } = useAuth();

    if (user) {
        if (user.role === "RECRUITER") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        if (user.role === "CANDIDATE") {
            return <Navigate to="/candidate/dashboard" replace />;
        }

        if (user.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    return children;
}

export default GuestRoute;