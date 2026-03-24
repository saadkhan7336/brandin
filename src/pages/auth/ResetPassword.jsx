import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Key, ArrowLeft } from 'lucide-react';

import { Input } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import {
  setLoading,
  setError,
  setMessage,
  clearAuthState
} from '../../redux/slices/authSlice';

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message, resetEmail } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!resetEmail) {
      navigate('/forgot-password');
    }
  }, [resetEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await api.post(ENDPOINTS.RESET_PASSWORD, {
        email: resetEmail,
        otp: formData.otp,
        password: formData.password
      });
      
      dispatch(setMessage(response.data.message || "Password reset successful"));
      
      setTimeout(() => {
        dispatch(clearAuthState());
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Reset failed"));
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
        <div className="mb-6">
          <Link to="/forgot-password" className="inline-flex items-center text-sm text-[#3b82f6] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Forgot Password
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Key className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Reset Password</h1>
          <p className="text-[#6b7280]">Enter the OTP sent to <b>{resetEmail}</b> and your new password</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="OTP Code"
            name="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            icon={<Key className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={<Lock className="w-5 h-5 text-gray-400" />}
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
