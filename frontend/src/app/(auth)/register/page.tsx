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