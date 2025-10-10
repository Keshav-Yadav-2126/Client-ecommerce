// pages/auth/Register.jsx
import CommonForm from '@/components/common/form'
import useAuthStore from '@/store/auth-slice/auth-store';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

const Register = () => {
  const {registerUser, isLoading, error} = useAuthStore();
  const navigate = useNavigate();

  async function handleRegister(formData) {
    console.log("Registering with data:", formData);
    const data = await registerUser(formData);
    console.log("Registration response:", data);
    if (data?.success || data?.user) {
      toast(data.message, {
        duration: 1000,
        icon: '✅',
      });
      navigate("/auth/login"); // Redirect to login on success
    }
    else{
      toast(data.message, {
        duration: 2000,
      });
    }
  }

  return (
    <div className='mx-auto w-full space-y-6'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4'>
            <span className='text-2xl'>🌿</span>
          </div>
          <h2 className='text-3xl font-bold text-primary mb-2'>Join Pachory Family!</h2>
          <p className='text-muted-foreground'>Create your account for organic nutrition</p>
        </div>
      </div>

      {/* Form */}
      <CommonForm isLoading={isLoading} error={error} type='register' handleSubmit={handleRegister}/>
      
      {/* Benefits Section */}
      <div className='bg-muted/50 rounded-lg p-4 mt-6'>
        <h3 className='font-semibold text-foreground mb-2'>Why choose Pachory?</h3>
        <ul className='text-sm text-muted-foreground space-y-1'>
          <li className='flex items-center gap-2'>
            <span className='text-primary'>✓</span> 100% Organic certified products
          </li>
          <li className='flex items-center gap-2'>
            <span className='text-primary'>✓</span> Expert nutrition guidance
          </li>
          <li className='flex items-center gap-2'>
            <span className='text-primary'>✓</span> Fast & secure delivery
          </li>
        </ul>
      </div>
      
      {/* Divider */}
      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-border'></div>
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-card px-2 text-muted-foreground'>Already have an account?</span>
        </div>
      </div>
      
      {/* Login Link */}
      <div className='text-center'>
        <Link 
          to='/auth/login' 
          className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors duration-200'
        >
          Sign In Instead
        </Link>
      </div>
    </div>
  )
}

export default Register