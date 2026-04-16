import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft } from 'lucide-react';

import { Input } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import {
  setLoading,
  setError,
  setMessage,
  setResetEmail
} from '../../redux/slices/authSlice';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });

      dispatch(setMessage(response.data.message || "OTP sent to your email"));
      dispatch(setResetEmail(email));

      // Delay navigation a bit to show message
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);

    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm text-[#3b82f6] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Forgot Password?</h1>
          <p className="text-[#6b7280]">Enter your email to receive a password reset OTP</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-5 h-5 text-gray-400" />}
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
}
