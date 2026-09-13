import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import "./styles/components.css";

import { AuthProvider } from "./context/AuthContext.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <App />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />
        </AuthProvider>
    </StrictMode>
);