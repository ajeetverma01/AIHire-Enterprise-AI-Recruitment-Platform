import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CandidateSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>AIHire</h2>
                <p>Candidate Portal</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/candidate/dashboard"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/candidate/applications"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    My Applications
                </NavLink>


                <NavLink
                    to="/candidate/resumes"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    My Resumes
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <p>{user?.email || "Candidate"}</p>
                <button
                    className="btn btn-secondary"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default CandidateSidebar;
