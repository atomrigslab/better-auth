import React from 'react';

const AccountProfile = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left side with gradient background and welcome message */}
      <div className="w-3/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-700 to-blue-900 opacity-80"></div>
          <div className="absolute bottom-0 left-0 w-full h-full">
            <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-green-400 rounded-full filter blur-3xl opacity-30 transform translate-x-1/4 translate-y-1/4"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/2 bg-yellow-300 rounded-full filter blur-3xl opacity-20"></div>
          </div>
        </div>
        
        {/* Welcome text */}
        <div className="relative z-10 flex flex-col justify-center h-full p-16">
          <h1 className="text-6xl font-bold text-white mb-2">Welcome</h1>
          <h1 className="text-6xl font-bold text-white mb-8">Back to GuilPal.</h1>
          <p className="text-xl text-white">A new quest begins now. Are you in?</p>
        </div>
      </div>

      {/* Right side with account management */}
      <div className="w-2/5 bg-gray-900 p-8 flex flex-col">
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center text-green-400">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM8 9H16V19H8V9Z" fill="currentColor"/>
              <path d="M4 17H2V5C2 3.9 2.9 3 4 3H16V5H4V17Z" fill="currentColor"/>
              <circle cx="12" cy="15" r="2" fill="currentColor"/>
            </svg>
            <span className="text-xl font-semibold">GuildPal</span>
            <span className="text-xl text-gray-300 ml-4">Manage Account</span>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="mb-6">
          <h2 className="text-white text-lg mb-4 text-center">Profile Settings</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Your E-mail</p>
                <p className="text-gray-300">-</p>
              </div>
              <button className="bg-transparent text-green-400 px-2 py-1 rounded text-sm">
                Connect +
              </button>
            </div>
          </div>
        </div>

        {/* SNS & Wallet Connections */}
        <div className="mb-6">
          <h2 className="text-white text-lg mb-4 text-center">SNS & Wallet Connections</h2>
          
          {/* Google */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white">Google</p>
                  <p className="text-green-400 text-sm">PGA123@gmail.com</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Connection</span>
            </div>
          </div>
          
          {/* Facebook */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center bg-blue-600 rounded-full">
                  <span className="text-white font-bold">f</span>
                </div>
                <div>
                  <p className="text-white">Facebook</p>
                  <p className="text-gray-400 text-sm">-</p>
                </div>
              </div>
              <button className="bg-transparent text-green-400 px-2 py-1 rounded text-sm">
                Connect +
              </button>
            </div>
          </div>
          
          {/* Ronin Wallet */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <p className="text-white">Ronin Wallet</p>
                  <p className="text-gray-400 text-sm">-</p>
                </div>
              </div>
              <button className="bg-transparent text-green-400 px-2 py-1 rounded text-sm">
                Connect +
              </button>
            </div>
          </div>
          
          {/* Metamask Wallet */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center text-orange-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4 0L13.1 7.7L14.6 3.5L21.4 0Z" fill="#E17726"/>
                    <path d="M2.6 0L10.8 7.8L9.4 3.5L2.6 0Z" fill="#E27625"/>
                    <path d="M18.7 17.2L16.5 21.2L21.1 22.7L22.4 17.3L18.7 17.2Z" fill="#E27625"/>
                    <path d="M1.6 17.3L2.9 22.7L7.5 21.2L5.3 17.2L1.6 17.3Z" fill="#E27625"/>
                    <path d="M7.3 10.6L6 13L10.5 13.2L10.3 8.3L7.3 10.6Z" fill="#E27625"/>
                    <path d="M16.7 10.6L13.7 8.2L13.5 13.2L18 13L16.7 10.6Z" fill="#E27625"/>
                    <path d="M7.5 21.2L10.2 19.6L7.9 17.3L7.5 21.2Z" fill="#E27625"/>
                    <path d="M13.8 19.6L16.5 21.2L16.1 17.3L13.8 19.6Z" fill="#E27625"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white">Metamask Wallet</p>
                  <p className="text-gray-400 text-sm">-</p>
                </div>
              </div>
              <button className="bg-transparent text-green-400 px-2 py-1 rounded text-sm">
                Connect +
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto flex justify-between items-center text-sm">
          <p className="text-gray-500">© 2025 PGA Platform</p>
          <div className="flex items-center">
            <p className="text-gray-500 mr-2">Do you need help with logging in?</p>
            <a href="#" className="text-white underline">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;