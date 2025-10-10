// pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import useAuthStore from '@/store/auth-slice/auth-store';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, isLoading } = useAuthStore();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const result = await resetPassword(token, passwords.newPassword);
    
    if (result.success) {
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } else {
      toast.error(result.message || 'Failed to reset password');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <Link
            to="/auth/login"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all inline-block"
          >
            Continue to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-green-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating Password...
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        {/* Back to login link */}
        <div className="text-center pt-6 border-t border-green-100 mt-6">
          <Link 
            to="/auth/login" 
            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;