// components/auth/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';
import useAuthStore from '@/store/auth-slice/auth-store';
import { toast } from 'sonner';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const result = await forgotPassword(email);
    
    if (result.success) {
      setIsSubmitted(true);
      toast.success('Password reset email sent successfully!');
    } else {
      toast.error(result.message || 'Failed to send reset email');
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-primary" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
                <p className="text-muted-foreground text-sm">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-primary" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Check Your Email!</h2>
                <p className="text-muted-foreground mb-6">
                  We've sent password reset instructions to{' '}
                  <span className="font-medium text-primary">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                >
                  Got It
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;