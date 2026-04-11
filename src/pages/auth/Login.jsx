import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Lock, Mail } from 'lucide-react';
import { getDashboardByRole } from '../../routes/ProtectedRoute';

import { Input } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { setLoading, setAuthUser, clearAuthState } from '../../redux/slices/authSlice';

const validate = (field, value) => {
  switch (field) {
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      return '';
    default:
      return '';
  }
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardByRole(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
    setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errors = {
      email: validate('email', formData.email),
      password: validate('password', formData.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      dispatch(setLoading(true));
      setSubmitError('');

      await api.post(ENDPOINTS.LOGIN, formData);
      const res = await api.get(ENDPOINTS.ME);
      const { user: authUser } = res.data.data;

      dispatch(setAuthUser(authUser));
      navigate(getDashboardByRole(authUser.role));
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
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
          <p className="text-[#6b7280] font-medium text-sm mt-1">Login to your Brandly account</p>
        </div>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-5 text-sm border border-red-100 flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-1">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.email ? fieldErrors.email : ''}
            icon={<Mail className="w-4 h-4 text-gray-400" />}
          />

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.password ? fieldErrors.password : ''}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
            />
            <div className="flex justify-end -mt-2 mb-2">
              <Link to="/forgot-password" className="text-sm text-[#3b82f6] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#6b7280] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3b82f6] font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
