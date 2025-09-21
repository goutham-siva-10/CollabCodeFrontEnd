import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // adjust if needed
import { AuthProvider } from "./context/AuthContext.jsx"; // ensure you have this

export default function App() {
    return (
        <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/editor/:id"
                        element={
                            <ProtectedRoute>
                                <EditorPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            
        </AuthProvider>
    );
}
