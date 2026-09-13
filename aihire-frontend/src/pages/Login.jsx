import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await axiosClient.post("/api/auth/login", {
                email,
                password,
            });

            const { accessToken, refreshToken, userEmail, role } = response.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("role", role);

            if (role === "RECRUITER") {
                navigate("/recruiter/dashboard");
            } else if (role === "CANDIDATE") {
                navigate("/candidate/dashboard");
            } else if (role === "ADMIN") {
                navigate("/admin/dashboard");
            }

            console.log("Login successful");


        } catch (error) {

            console.error("Login failed:", error);

        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;