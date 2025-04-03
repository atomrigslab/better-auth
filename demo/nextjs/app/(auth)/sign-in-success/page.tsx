"use client";

import { pga } from "@/lib/auth-client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    pga.addMid({ encryptedMid: "fake-mid-1" });
  }, [])

  return (
    <div className="w-full">
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

        <div className="flex w-full flex-col items-center justify-between bg-black lg:w-1/2">
          <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-8">
            <div className="mb-8 overflow-hidden rounded-lg bg-gray-900">
              {/* Header */}
              <div className="bg-green-500 py-4 text-center text-lg font-semibold text-white">
                계정 연결 완료!
              </div>

              {/* Content */}
              <div className="flex flex-col items-center p-8">
                {/* Check icon */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800">
                  <svg
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                {/* Success message */}
                <h3 className="mb-6 text-center text-xl font-medium text-white">
                  PGA 계정이 성공적으로 연결되었습니다
                </h3>

                {/* Reward notification */}
                <div className="mb-6 flex w-full items-center rounded-lg border border-gray-800 bg-gray-800 p-4">
                  <div className="mr-4 h-10 w-10 flex-shrink-0 rounded-full bg-yellow-300"></div>
                  <div>
                    <p className="font-medium text-white">축하합니다!</p>
                    <p className="text-sm text-gray-400">
                      특별한 '알'을 획득했습니다.
                    </p>
                  </div>
                </div>

                {/* Start button */}
                {/* <button className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600">
            시작하기
          </button> */}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-gray-500">
              © 2025 PGA Platform |
              <a href="#" className="ml-1 text-green-500 hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
