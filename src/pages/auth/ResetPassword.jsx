import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Key, ArrowLeft } from 'lucide-react';

import { Input } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { setLoading, setMessage, clearAuthState } from '../../redux/slices/authSlice';

const validate = (field, value, formData) => {
  switch (field) {
    case 'otp':
      if (!value.trim()) return 'OTP is required';
      if (value.trim().length !== 6) return 'OTP must be exactly 6 digits';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    case 'confirmPassword':
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    default:
      return '';
  }
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, message, resetEmail } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ otp: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!resetEmail) navigate('/forgot-password');
  }, [resetEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate(name, value, updated) }));
    }
    if (name === 'password' && touched.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: validate('confirmPassword', updated.confirmPassword, updated) }));
    }
    setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value, formData) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { otp: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const errors = {
      otp: validate('otp', formData.otp, formData),
      password: validate('password', formData.password, formData),
      confirmPassword: validate('confirmPassword', formData.confirmPassword, formData),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      dispatch(setLoading(true));
      setSubmitError('');

      const response = await api.post(ENDPOINTS.RESET_PASSWORD, {
        email: resetEmail,
        otp: formData.otp,
        password: formData.password,
      });

      dispatch(setMessage(response.data.message || 'Password reset successful'));

      setTimeout(() => {
        dispatch(clearAuthState());
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Reset failed. Check your OTP and try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Link to="/forgot-password" className="inline-flex items-center text-sm text-[#3b82f6] hover:underline font-medium">
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
          <p className="text-[#6b7280] text-sm mt-1">
            Enter the OTP sent to <b>{resetEmail}</b> and choose a new password
          </p>
        </div>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-5 text-sm border border-red-100 flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
            {submitError}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3.5 rounded-xl mb-5 text-sm border border-green-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-1">
          <Input
            label="OTP Code"
            name="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            maxLength={6}
            error={touched.otp ? fieldErrors.otp : ''}
            icon={<Key className="w-4 h-4 text-gray-400" />}
          />

          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.password ? fieldErrors.password : ''}
            icon={<Lock className="w-4 h-4 text-gray-400" />}
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
            icon={<Lock className="w-4 h-4 text-gray-400" />}
          />

          <div className="pt-2">
            <Button type="submit" isLoading={loading} className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
