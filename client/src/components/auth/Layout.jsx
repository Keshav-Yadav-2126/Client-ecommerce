// components/auth/Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div className='flex min-h-screen w-full bg-pachory-gradient'>
        <div className='hidden lg:flex items-center justify-center bg-pachory-green-gradient w-1/2 px-12 relative overflow-hidden'>
            {/* Background decorative elements */}
            <div className='absolute inset-0 opacity-20'>
                <div className='absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-organic-float'></div>
                <div className='absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full animate-organic-float' style={{animationDelay: '1s'}}></div>
                <div className='absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-organic-float' style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className='max-w-md space-y-6 text-center text-white relative z-10'>
                <div className='mb-8'>
                    <h1 className='text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg'>
                        Pachory
                    </h1>
                    <h2 className='text-2xl font-semibold text-white/90 mb-2'>
                        Organic Nutrition
                    </h2>
                    <div className='w-24 h-1 bg-white/80 mx-auto rounded-full mb-6'></div>
                </div>
                
                <p className='text-lg leading-relaxed text-white/90'>
                    Discover the power of nature's finest organic nutrition products for a healthier lifestyle
                </p>
                
                <div className='flex items-center justify-center space-x-4 mt-8'>
                    <div className='w-3 h-3 bg-white/80 rounded-full animate-organic-pulse'></div>
                    <div className='w-3 h-3 bg-white/60 rounded-full animate-organic-pulse' style={{animationDelay: '0.5s'}}></div>
                    <div className='w-3 h-3 bg-white/40 rounded-full animate-organic-pulse' style={{animationDelay: '1s'}}></div>
                </div>
                
                {/* Decorative leaf icons */}
                <div className='absolute -bottom-10 -left-10 text-white/20 text-6xl'>🌿</div>
                <div className='absolute -top-5 -right-5 text-white/20 text-4xl'>🍃</div>
            </div>
        </div>
        
        <div className='flex flex-1 items-center justify-center bg-gradient-to-br from-background via-muted to-secondary px-4 py-12 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md'>
                <div className='bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border p-8 relative'>
                    {/* Subtle gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl'></div>
                    <div className='relative z-10'>
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Authlayout;