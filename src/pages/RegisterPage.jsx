import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/register", {
                username,
                password,
            });
            alert("Registration successful. Please login.");
            navigate("/login");
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Register</h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-2 w-80">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">
                    Register
                </button>
            </form>
            <button onClick={() => navigate("/login")} className="underline text-blue-600">
                Already have an account? Login
            </button>
        </div>
    );
}
