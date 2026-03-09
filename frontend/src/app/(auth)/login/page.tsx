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
            <button className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 border border-gray-400 rounded-full hover:bg-white/20">
              <Mail className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-500">Email</span>
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