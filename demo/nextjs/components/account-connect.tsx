import React from "react";

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
          <h1 className="text-6xl font-bold leading-tight">
            Welcome
            <br />
            Back to GuilPal.
          </h1>
          <p className="mt-6 text-xl">A new quest begins now. Are you in?</p>
        </div>
      </div>

      {/* Right section with account management */}
      <div className="flex w-full flex-col justify-between bg-black lg:w-1/2">
        <div className="mb-12">
          <svg
            className="w-24 h-24 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-white text-3xl font-bold mb-3">
          로그인 수단 추가하기
        </h1>
        <p className="text-gray-400 text-lg mb-8 text-center">
          다양한 로그인 수단을 추가하여 더 편리하게 이용하세요.
        </p>

        {/* Login Method Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Email Button */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-4 flex items-center transition">
            <div className="bg-blue-500 rounded-full p-2 mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <span className="text-lg">이메일 추가</span>
          </button>

          {/* Phone Button */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-4 flex items-center transition">
            <div className="bg-green-500 rounded-full p-2 mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <span className="text-lg">전화번호 추가</span>
          </button>

          {/* Google Button (Already Connected) */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-gray-500 rounded-lg p-4 flex items-center justify-between transition cursor-not-allowed">
            <div className="flex items-center">
              <div className="mr-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span className="text-lg">Google 계정 연결</span>
            </div>
            <span className="text-gray-500">(이미 연결됨)</span>
          </button>

          {/* Ronin Wallet Button */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-4 flex items-center transition">
            <div className="mr-4">
              <svg
                className="w-8 h-8 text-blue-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22.5l-9.9-6.9L12 5.5l9.9 10.1L12 22.5z M12 0l-8.19 12.84L12 16.5l8.19-3.66L12 0z" />
              </svg>
            </div>
            <span className="text-lg">Ronin Wallet 연결</span>
          </button>

          {/* Metamask Button */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-4 flex items-center transition">
            <div className="mr-4">
              <svg
                className="w-8 h-8 text-orange-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
            </div>
            <span className="text-lg">Metamask 연결</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex mt-8 w-full max-w-md gap-4">
          <button className="flex-1 bg-transparent text-gray-400 hover:text-white py-3 rounded-lg transition">
            나중에 하기
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
            연결하기
          </button>
        </div>
      </div>
    </div>
  );
}
