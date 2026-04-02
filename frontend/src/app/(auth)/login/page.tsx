import React from 'react';
import { Mail, Lock } from 'lucide-react';
import Title from '@/components/Title';

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8DF] font-sans text-slate-700">
      {/* Header - Navigation removed here as well per the top circle */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-black rounded-full" />
          <span className="font-bold text-xl tracking-tight">UTSC Alumni</span>
        </div>
        {/* Top Nav links removed to match your request */}
      </header>

      {/* Main Sign-In Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <Title text="Sign in" />

        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-14 pr-6 py-4 bg-transparent border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="************"
              className="w-full pl-14 pr-6 py-4 bg-transparent border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-[#5B7B94] hover:underline">Forgot password?</a>
          </div>

          <button className="w-full py-4 bg-[#7B6658] text-white font-bold rounded-xl hover:opacity-90 transition-opacity mt-4">
            Login
          </button>

          <div className="text-center mt-10 space-y-4">

    <p className="text-sm text-gray-500">Or login with</p>
    <button type="button" className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-3 border border-gray-400 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm">
   
    {/* Google Icon */}
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"/>
    </svg>
    <span className="font-semibold text-gray-700">Google</span>
    </button>
    </div>

          <p className="text-center mt-8 text-sm">
            Not a member? <a href="#" className="font-bold underline">Sign up now</a>
          </p>
        </div>
      </main>

      {/* Footer - Navigation links removed per your lower circle */}
      <footer className="bg-[#E6DACC] py-8 px-8 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#222] text-white flex items-center justify-center rounded-full text-xs font-bold">N</div>
          <span className="font-bold text-lg">UTSC Alumni</span>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;