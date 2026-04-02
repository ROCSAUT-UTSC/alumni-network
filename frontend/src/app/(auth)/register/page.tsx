"use client";
import React, { useState } from 'react';
import { Star, User, Search, Mail, Lock, ChevronDown } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const [userType, setUserType] = useState<'alumni' | 'student'>('alumni');

  return (
    <div className="min-h-screen bg-[#FDF5F0] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="px-8 py-4 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
             <span className="text-white text-xs">Logo</span>
          </div>
          <span className="font-semibold text-[#2D5A75]">UTSC Alumni</span>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-black">Features</a>
          <a href="#" className="hover:text-black">Directory</a>
          <a href="#" className="hover:text-black">Community</a>
          <a href="#" className="hover:text-black">Events</a>
        </nav>
      </header>

      {/* Main Registration Form */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-[#4A8DA8] mb-8">Registration</h1>

        {/* Toggle Switch */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setUserType('alumni')}
            className={`px-8 py-2 rounded-xl border-2 border-[#6D4C41] transition-colors ${
              userType === 'alumni' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41]'
            }`}
          >
            Alumni
          </button>
          <button
            onClick={() => setUserType('student')}
            className={`px-8 py-2 rounded-xl border-2 border-[#6D4C41] transition-colors ${
              userType === 'student' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41]'
            }`}
          >
            Student
          </button>
        </div>

        {/* Form Fields */}
        <form className="w-full max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Star className="h-5 w-5 text-gray-800" />
              </div>
              <input
                type="text"
                placeholder="First Name..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#6D4C41] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A8DA8]"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Star className="h-5 w-5 text-gray-800" />
              </div>
              <input
                type="text"
                placeholder="Last Name..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#6D4C41] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A8DA8]"
              />
            </div>

            {/* Pronouns */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-800" />
              </div>
              <select className="w-full pl-12 pr-4 py-4 bg-white border border-[#6D4C41] rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A8DA8] text-gray-500">
                <option>Pronouns</option>
                <option>He/Him</option>
                <option>She/Her</option>
                <option>They/Them</option>
              </select>
            </div>

            {/* University */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-800" />
              </div>
              <input
                type="text"
                placeholder="University"
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#6D4C41] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A8DA8]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="h-6 w-6 text-gray-800" />
            </div>
            <input
              type="email"
              placeholder="School Email..."
              className="w-full pl-14 pr-4 py-4 bg-white border border-[#6D4C41] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A8DA8]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock className="h-6 w-6 text-gray-800" />
            </div>
            <input
              type="password"
              placeholder="************"
              className="w-full pl-14 pr-4 py-4 bg-[#D9D9D9] border border-[#6D4C41] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A8DA8]"
            />
          </div>

          {/* Register Button */}
          <div className="flex justify-center pt-4">
            <button className="px-16 py-3 bg-[#6D4C41] text-white text-lg font-medium rounded-xl hover:bg-[#5D3E35] transition-colors shadow-md">
              Register
            </button>
          </div>

          <div className="mt-8">
          <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400"></div>
          </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F2EBE3] text-gray-500">Or continue with</span>
            </div>
          </div>

  <button
    type="button"
    className="w-full max-w-xs mx-auto flex justify-center items-center gap-3 py-3 border border-gray-400 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm"
  >
    {/* Google Icon SVG */}
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span className="font-semibold text-gray-700">Continue with Google</span>
  </button>
</div>
</form>
</main>

      {/* Footer */}
      <footer className="px-8 py-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 gap-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-full"></div>
           <span className="font-semibold text-[#2D5A75]">UTSC Alumni</span>
        </div>
        <div className="flex gap-8 text-gray-700 text-sm">
          <a href="#">Features</a>
          <a href="#">Directory</a>
          <a href="#">Community</a>
          <a href="#">Events</a>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationPage;