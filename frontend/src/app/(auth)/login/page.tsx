export default function LoginPage() {
  return (
    // Main layout container: Stacks Header, Content, and Footer vertically
    <div className="min-h-screen flex flex-col font-sans text-black">
      
      {/* --- HEADER --- */}
      <nav className="w-full flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 border-2 border-black rounded-full" />
          <span className="font-bold text-xl text-[#4A728A]">UTSC Alumni</span>
        </div>
        <div className="flex gap-8 font-medium">
          <span>Features</span>
          <span>Directory</span>
          <span>Community</span>
          <span>Events</span>
        </div>
      </nav>

      {/* Main content*/}
      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          
          {/* Title */}
          <h1 className="text-6xl font-bold text-[#4A728A] mb-12">Sign in</h1>

          {/* Form content */}
          <div className="flex flex-col gap-5">
            
            {/* Input with Icon Layout */}
            <div className="relative">
              <span className="absolute inset-y-0 left-5 flex items-center">✉</span>
              <input 
                type="text" 
                placeholder="Email" 
                className="w-full pl-14 pr-6 py-4 border border-gray-400 rounded-full focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-5 flex items-center">🔒</span>
              <input 
                type="password" 
                placeholder="************" 
                className="w-full pl-14 pr-6 py-4 border border-gray-400 rounded-full focus:outline-none"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end -mt-3">
              <a 
                href="#" 
                className="text-sm text-[#4A728A] hover:underline transition-all"
              >
                Forgot password?
              </a>
            </div>

            {/* Button Content */}
            <div className="flex justify-center pt-2">
              <button className="px-16 py-3 bg-[#7A5C4F] text-white rounded-xl font-bold text-lg">
                Login
              </button>
            </div>
          </div>

          {/* Alternative Login Content */}
          <div className="mt-12">
            <p className="text-gray-400 text-sm mb-4">Or login with</p>
            <button className="flex items-center gap-3 px-10 py-2 border border-gray-400 rounded-full mx-auto">
              <span className="text-red-500">✉</span>
              <span className="text-red-500 font-bold">Email</span>
            </button>
            
            <p className="mt-10 text-gray-400 text-sm">
              Not a member? <span className="underline text-black font-medium">Sign up now</span>
            </p>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full flex items-center justify-between px-10 py-8 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-black rounded-full" />
          <span className="font-bold">UTSC Alumni</span>
        </div>
        <div className="flex gap-8 text-sm font-medium">
          <span>Features</span>
          <span>Directory</span>
          <span>Community</span>
          <span>Events</span>
        </div>
      </footer>
    </div>
  );
}


