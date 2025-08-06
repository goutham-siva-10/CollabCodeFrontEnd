import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css"; // ✅ Import your CSS file

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", { username, password });
            const token = response.data.token;

            localStorage.setItem("token", token);
            setToken(token);

            alert("Login successful!");
            navigate("/home", { replace: true });
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
                <div className="register-link">
                    <a onClick={() => navigate("/register")}>Don't have an account? Register</a>
                </div>
            </div>
        </div>
    );
}
