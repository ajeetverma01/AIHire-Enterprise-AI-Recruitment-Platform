import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../api/axiosClient";

import { toast } from "react-toastify";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CANDIDATE");


    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await axiosClient.post("/api/auth/register", {
                name,
                email,
                password,
                role,
            });

            toast.success("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            if (error.response) {
                toast.error(
                    error.response.data.message || "Registration failed."
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
                    <p>Create your account</p>
                </div>


                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            className="input"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Account Type</label>

                        <div className="role-options">

                            <label className="role-option">
                                <input
                                    type="checkbox"
                                    checked={role === "CANDIDATE"}
                                    onChange={() => setRole("CANDIDATE")}
                                />
                                Candidate
                            </label>

                            <label className="role-option">
                                <input
                                    type="checkbox"
                                    checked={role === "RECRUITER"}
                                    onChange={() => setRole("RECRUITER")}
                                />
                                Recruiter
                            </label>

                        </div>
                    </div>

                    <button
                        className="btn btn-primary auth-button"
                        type="submit"
                    >
                        Create Account
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <button
                        className="auth-link"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;