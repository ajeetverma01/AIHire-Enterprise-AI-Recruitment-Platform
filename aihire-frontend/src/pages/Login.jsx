import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await axiosClient.post("/api/auth/login", {
                email,
                password,
            });

            login(response.data);

            toast.success("Login successful!");

            const role = response.data.role;

            if (role === "RECRUITER") {
                navigate("/recruiter/dashboard");
            } else if (role === "CANDIDATE") {
                navigate("/candidate/dashboard");
            } else if (role === "ADMIN") {
                navigate("/admin/dashboard");
            }

        } catch (error) {

            // console.error("Login failed:", error);

            if (error.response) {
                toast.error(
                    error.response.data.message || "Invalid credentials."
                );
            } else {
                toast.error(
                    "Unable to connect to the server. Please try again."
                );
            }
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>AIHire</h1>
                    <p>Welcome back</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        className="btn btn-primary auth-button"
                        type="submit"
                    >
                        Login
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <button
                        className="auth-link"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Login;