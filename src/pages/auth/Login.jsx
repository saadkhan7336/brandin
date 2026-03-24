import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield, Lock, Mail } from "lucide-react";

import { Input } from "../../components/common/FormComponents";
import { Button } from "../../components/common/Button";

import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";
import {
  setLoading,
  setError,
  setAuthUser,
  clearAuthState,
} from "../../redux/slices/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(setLoading(true));
  //     await api.post(ENDPOINTS.LOGIN, formData);

  //     const res = await api.get(ENDPOINTS.ME);
  //      dispatch(setAuthUser(res.data.data))
  //      localStorage.setItem('brandly_has_session', 'true');
  //     navigate('/dashboard');

  //   } catch (err) {
  //     dispatch(setError(err.response?.data?.message || "Login failed"));
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      // Step 1: Login → cookies set
      await api.post(ENDPOINTS.LOGIN, formData);

      // Step 2: Get user from backend via cookies
      const res = await api.get(ENDPOINTS.ME);

      // Step 3: Store in Redux
      dispatch(setAuthUser(res.data.data));

      // Step 4: Redirect
      navigate("/dashboard");
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Welcome Back</h1>
          <p className="text-[#6b7280]">Login to your Brandly account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="w-5 h-5 text-gray-400" />}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<Lock className="w-5 h-5 text-gray-400" />}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                size="sm"
                className="text-sm text-[#3b82f6] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#6b7280]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#3b82f6] font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
