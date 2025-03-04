import React from 'react'
import { Navigate } from "react-router-dom";

export function Protected({ children, adminOnly = false }) {
    const token = sessionStorage.getItem("token")
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!token) {
        return <Navigate to="/login" />;
    }
    if (adminOnly && (!user || !user.isAdmin)) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
}


