// pages/auth/Login.jsx
import CommonForm from '@/components/common/form'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '@/store/auth-slice/auth-store.js';
import { toast } from 'sonner';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

const Login = () => {
  const { loginUser, isLoading, error } = useAuthStore();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  async function handleLogin({email, password}) {
    console.log("Logging in with data:", { email, password });
    const data = await loginUser({ email, password });
    if (data?.success || data?.user) {
      toast(data.message, {
        duration: 2000,
        icon: '✅',
      });
    }
    else{
      toast(data.message, {
        duration: 2000,
      });
    }
  }

  return (
    <>
      <div className='mx-auto w-full space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='mb-6'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4'>
              <span className='text-2xl'>🌱</span>
            </div>
            <h2 className='text-3xl font-bold text-primary mb-2'>Welcome Back!</h2>
            <p className='text-muted-foreground'>Sign in to your Pachory account</p>
          </div>
        </div>

        {/* Form */}
        <CommonForm isLoading={isLoading} error={error} type='login' handleSubmit={handleLogin}/>
        
        {/* Forgot Password Link */}
        <div className='text-center'>
          <button
            onClick={() => setShowForgotPassword(true)}
            className='text-primary hover:text-primary/80 text-sm font-medium hover:underline transition-colors duration-200'
          >
            Forgot your password?
          </button>
        </div>
        
        {/* Divider */}
        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-border'></div>
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card px-2 text-muted-foreground'>New to Pachory?</span>
          </div>
        </div>
        
        {/* Register Link */}
        <div className='text-center'>
          <Link 
            to='/auth/register' 
            className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors duration-200'
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  )
}

export default Login