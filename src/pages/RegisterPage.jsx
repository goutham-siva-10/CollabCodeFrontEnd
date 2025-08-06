import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import "./LoginPage.css"; // reusing same CSS for consistency

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/register", { username, password });
            alert("Registration successful. Please login.");
            navigate("/login");
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                <div className="register-link">
                    <p>
                        Already have an account?{" "}
                        <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
