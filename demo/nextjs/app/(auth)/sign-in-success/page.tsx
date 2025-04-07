"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { client, pga } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const loginMethod = searchParams.get("login_method");

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const session = await client.getSession();
    if (session.error) return;
    setEmail(session.data.user?.email);
    const foundWallet = session.data.wallet.find((w) => w.name === loginMethod);
    if (foundWallet?.address) {
      setAddress(foundWallet?.address);
    }
    window.pga.helpers.setAuthToken(session.data);
    pga.addMid({ encryptedMid: "fake-mid-1" });
  };

  const routeToManageAccount = () => {
    router.push("/account-profile");
  };

  const renderLoginInfo = () => {
    switch (loginMethod) {
      case "email":
        return (
          <div className="mb-4 rounded-lg bg-gray-700 py-2 px-4">
            <p className="text-gray-400 text-sm mb-1">Logged in with Email</p>
            <p className="text-white break-all">{email}</p>
          </div>
        );
      case "ronin":
        return (
          <div className="mb-4 rounded-lg bg-gray-700 py-2 px-4">
            <p className="text-gray-400 text-sm mb-1">
              Logged in with Ronin Wallet
            </p>
            <p className="text-white break-all font-mono text-sm">{address}</p>
          </div>
        );
      case "metamask":
        return (
          <div className="mb-4 rounded-lg bg-gray-700 py-2 px-4">
            <p className="text-gray-400 text-sm mb-1">
              Logged in with Metamask Wallet
            </p>
            <p className="text-white break-all font-mono text-sm">{address}</p>
          </div>
        );
      case "google":
        return (
          <div className="mb-4 rounded-lg bg-gray-700 py-2 px-4">
            <p className="text-gray-400 text-sm mb-1">Logged in with Google</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-sm">{email}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="mb-4 rounded-lg bg-gray-700 py-2 px-4 text-center">
            {email ? (
              <p className="text-gray-400">{email}</p>
            ) : (
              <p className="text-gray-400">{address}</p>
            )}
          </div>
        );
    }
  };

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

      {/* Right section - takes full width on mobile */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md p-4">
          {/* Small welcome message for mobile only */}
          <div className="mb-6 lg:hidden">
            <h1 className="text-center text-3xl font-bold text-white">
              Welcome Back to GuilPal.
            </h1>
            <p className="mt-2 text-center text-white">
              A new quest begins now.
            </p>
          </div>

          <div className="rounded-xl bg-gray-800 p-8 shadow-lg">
            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-center text-white">
                You have successfully logged in.
              </p>
            </div>

            {renderLoginInfo()}

            <button
              className="w-full rounded-lg bg-green-500 py-3 font-medium text-white hover:bg-green-600"
              onClick={routeToManageAccount}
            >
              Manage Account
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col justify-between space-y-2 px-2 text-xs text-gray-500 sm:flex-row sm:space-y-0">
            <div>© 2025 PGA Platform</div>
            <div>
              Do you need help with logging in?{" "}
              <span className="underline">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
