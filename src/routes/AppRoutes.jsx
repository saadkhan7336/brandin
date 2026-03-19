import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import React from 'react'
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Campaign from "../pages/campaigns/Campaign";
import Profile from "../pages/profile/Profile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";

function AppRoutes() {
  return (
    <Router>
        <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/verify-otp" element={<VerifyOtp/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                 {/* Protected Routes */}
                 <Route element={<ProtectedRoute/>}>
                 <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaign />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        </Routes>
    </Router>
  )
}


export default AppRoutes
