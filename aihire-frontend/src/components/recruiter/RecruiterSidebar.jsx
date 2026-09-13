import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function RecruiterSidebar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>AIHire</h2>
                <span>Recruiter</span>
            </div>

            <nav className="sidebar-nav">

                <button
                    onClick={() => navigate("/recruiter/dashboard")}
                >
                    Dashboard
                </button>

                <button>
                    My Jobs
                </button>

                <button
                    onClick={() => navigate("/recruiter/jobs/create")}
                >
                    Create Job
                </button>

            </nav>

            <button
                className="sidebar-logout"
                onClick={handleLogout}
            >
                Logout
            </button>

        </aside>
    );
}

export default RecruiterSidebar;