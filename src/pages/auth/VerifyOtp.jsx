import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Key, ArrowLeft } from 'lucide-react';

import { Input } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';
import { setResetEmail } from '../../redux/slices/authSlice';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { resetEmail } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [touched, setTouched] = useState(false);

  const email = resetEmail || location.state?.email;

  useEffect(() => {
    if (location.state?.email && !resetEmail) {
      dispatch(setResetEmail(location.state.email));
    }
  }, [location.state, resetEmail, dispatch]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const validate = (value) => {
    if (!value.trim()) return 'OTP is required';
    if (value.trim().length !== 6) return 'OTP must be exactly 6 digits';
    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (touched) setFieldError(validate(value));
  };

  const handleBlur = () => {
    setTouched(true);
    setFieldError(validate(otp));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate(otp);
    setFieldError(err);
    if (err) return;
    navigate('/reset-password', { state: { otp } });
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
          <h1 className="text-2xl font-bold text-[#111827]">Verify OTP</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Input
            label="OTP Code"
            name="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            maxLength={6}
            error={touched ? fieldError : ''}
            icon={<Key className="w-4 h-4 text-gray-400" />}
          />

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
