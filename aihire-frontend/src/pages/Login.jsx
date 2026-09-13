import { useState } from "react";
import axiosClient from "../api/axiosClient";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axiosClient.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

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