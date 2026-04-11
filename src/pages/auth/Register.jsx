import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Briefcase, Users, Mail, Lock, User } from 'lucide-react';

import { Input } from '../../components/common/FormComponents.jsx';
import { Button } from '../../components/common/Button.jsx';

import api from '../../services/api.js';
import { ENDPOINTS } from '../../services/endpoints.js';
import {
  setLoading,
  setError,
  setMessage,
  clearAuthState,
} from '../../redux/slices/authSlice.js';

// ── Validation matching backend Joi schema ─────────────────────────────────
const validate = (field, value, formData) => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 3) return 'Name must be at least 3 characters';
      if (value.trim().length > 50) return 'Name cannot exceed 50 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
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

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Clear auth error state on mount so stale errors don't appear
  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  // If already logged in redirect away
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleRoleSelect = (role) => {
    setUserType(role);
    setFormData(prev => ({ ...prev, role }));
    setFieldErrors({});
    setTouched({});
    setSubmitError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Validate on change only for touched fields
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate(name, value, updated) }));
    }
    // Always revalidate confirmPassword when password changes
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

    // Validate all fields before submit
    const allTouched = { name: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const errors = {
      name: validate('name', formData.name, formData),
      email: validate('email', formData.email, formData),
      password: validate('password', formData.password, formData),
      confirmPassword: validate('confirmPassword', formData.confirmPassword, formData),
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    try {
      dispatch(setLoading(true));
      setSubmitError('');

      await api.post(ENDPOINTS.REGISTER, {
        fullname: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      dispatch(setMessage('Registration successful! Please login.'));
      navigate('/login');
    } catch (err) {
      // Show error inline — do NOT navigate away
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Step 1: Role picker ────────────────────────────────────────────────
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#3b82f6] rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-1 sm:mb-2">Join Brandly</h1>
              <p className="text-sm sm:text-base text-[#6b7280]">Choose your account type to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <button
                onClick={() => handleRoleSelect('brand')}
                className="p-6 sm:p-8 border-2 border-[#e5e7eb] rounded-xl hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all group text-left"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#eff6ff] rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#3b82f6] transition-colors">
                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-[#3b82f6] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-1 sm:mb-2">I'm a Brand</h3>
                  <p className="text-sm sm:text-base text-[#6b7280]">Find and collaborate with influencers to boost your brand</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('influencer')}
                className="p-6 sm:p-8 border-2 border-[#e5e7eb] rounded-xl hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all group text-left"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#eff6ff] rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#3b82f6] transition-colors">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#3b82f6] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-1 sm:mb-2">I'm an Influencer</h3>
                  <p className="text-sm sm:text-base text-[#6b7280]">Get discovered and work with amazing brands</p>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-[#6b7280]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3b82f6] hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Registration form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#3b82f6] rounded-full flex items-center justify-center">
                {userType === 'brand' ? (
                  <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                ) : (
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-1 capitalize">
              Sign up as {userType}
            </h1>
            <button
              onClick={() => setUserType(null)}
              className="text-xs sm:text-sm text-[#3b82f6] hover:underline underline-offset-4"
            >
              Change account type
            </button>
          </div>

          {submitError && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-1">
            <Input
              label={userType === 'brand' ? 'Brand Name' : 'Full Name'}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={userType === 'brand' ? 'Your Company Name' : 'John Doe'}
              required
              error={touched.name ? fieldErrors.name : ''}
              icon={<User className="w-4 h-4 text-gray-400" />}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              required
              error={touched.email ? fieldErrors.email : ''}
              icon={<Mail className="w-4 h-4 text-gray-400" />}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min. 6 characters"
              required
              error={touched.password ? fieldErrors.password : ''}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              required
              error={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center mt-5">
            <p className="text-xs sm:text-sm text-[#6b7280]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#3b82f6] hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
