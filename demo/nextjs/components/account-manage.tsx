import React from 'react';

export default function AccountManagement() {
  return (
    <div className="flex h-screen w-screen bg-black">
      {/* Left section with gradient background */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-600 to-green-400 opacity-90">
          {/* Blob shapes overlay */}
          <div className="absolute bottom-0 left-0 h-4/5 w-4/5 rounded-full bg-blue-500/30 blur-3xl"></div>
          <div className="absolute right-0 top-1/3 h-4/5 w-4/5 rounded-full bg-green-500/30 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-center p-16 text-white">
          <h1 className="text-6xl font-bold leading-tight">Welcome<br />Back to GuilPal.</h1>
          <p className="mt-6 text-xl">A new quest begins now. Are you in?</p>
        </div>
      </div>
      
      {/* Right section with account management */}
      <div className="flex w-full flex-col justify-between bg-black lg:w-1/2">
        {/* Header */}
        <div className="flex items-center justify-end p-8">
          <svg 
            className="mr-2 h-8 w-8 text-green-500" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 6.5C12 5.11929 14 3 18 3C18 6.5 16.5 10 12 10C7.5 10 6 6.5 6 3C10 3 12 5.11929 12 6.5Z" />
            <path d="M12 10C16.5 10 18 6.5 18 3C18 3 21.5 4 21.5 8.5C21.5 13 18 18 12 20.5C6 18 2.5 13 2.5 8.5C2.5 4 6 3 6 3C6 6.5 7.5 10 12 10Z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-500">GuildPal Manage Account</h2>
        </div>
        
        {/* Main content */}
        <div className="flex-1 px-8 py-4">
          <div className="space-y-4">
            {/* Profile Settings */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-4 text-center text-lg font-medium text-white">Profile Settings</h3>
              
              <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
                <div>
                  <p className="text-xs text-gray-400">Your E-mail</p>
                  <p className="text-gray-300">-</p>
                </div>
                <button className="rounded-md px-2 py-1 text-xs font-medium text-green-500 hover:text-green-400">
                  Connect +
                </button>
              </div>
            </div>
            
            {/* SNS & Wallet Connections */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-4 text-center text-lg font-medium text-white">SNS & Wallet Connections</h3>
              
              {/* Google */}
              <div className="mb-3 flex items-center justify-between rounded-md bg-gray-800 p-4">
                <div className="flex items-center">
                  <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-white">Google</p>
                    <p className="text-xs text-green-500">lcs86@atomrigs.io</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Connected</span>
              </div>
              
              {/* Ronin Wallet */}
              <div className="mb-3 flex items-center justify-between rounded-md bg-gray-800 p-4">
                <div className="flex items-center">
                  <svg className="mr-3 h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                  </svg>
                  <div>
                    <p className="text-white">Ronin Wallet</p>
                    <p className="text-xs text-gray-400">-</p>
                  </div>
                </div>
                <button className="rounded-md px-2 py-1 text-xs font-medium text-green-500 hover:text-green-400">
                  Connect +
                </button>
              </div>
              
              {/* Metamask Wallet */}
              <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
                <div className="flex items-center">
                  <svg className="mr-3 h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.2347 2.25L10.5 7.979V11.2279L13.3776 13.2194L16.5 11.07V7.979L17.2347 2.25Z" />
                    <path d="M6.7653 2.25L13.5 7.979V11.2279L10.6224 13.2194L7.5 11.07V7.979L6.7653 2.25Z" />
                    <path d="M13.5 11.2279L10.5 7.979H13.5L17.2347 2.25H6.7653L10.5 7.979H13.5" />
                    <path d="M10.6224 13.2194L13.3776 11.2279H10.6224L7.5 7.979L6.7653 2.25L10.6224 13.2194Z" />
                    <path d="M13.3776 13.2194L10.6224 11.2279H13.3776L16.5 7.979L17.2347 2.25L13.3776 13.2194Z" />
                    <path d="M10.6224 13.2194L13.3776 16.3403V19.1102L8.82143 17.0069L7.5 11.07L10.6224 13.2194Z" />
                    <path d="M13.3776 13.2194L10.6224 16.3403V19.1102L14.8929 17.0069L16.5 11.07L13.3776 13.2194Z" />
                  </svg>
                  <div>
                    <p className="text-white">Metamask Wallet</p>
                    <p className="text-xs text-gray-400">-</p>
                  </div>
                </div>
                <button className="rounded-md px-2 py-1 text-xs font-medium text-green-500 hover:text-green-400">
                  Connect +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 text-xs text-gray-500">
          <span>© 2025 PGA Platform</span>
          <span>
            Do you need help with logging in? 
            <a href="#" className="ml-1 text-green-500 hover:underline">Support</a>
          </span>
        </div>
      </div>
    </div>
  );
}