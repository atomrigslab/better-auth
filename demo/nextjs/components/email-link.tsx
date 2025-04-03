import { emailOtp, pga, signIn } from "@/lib/auth-client";
import { useState } from "react";

export default function EmailLink() {
  const emailSignIn = async (args: {
    email: string;
    verificationCode: string;
  }) => {
    // const isLinked =
    //   !!pgaUser?.data?.user && !!pgaUser?.data?.user?.emailVerified;
    const { email, verificationCode } = args;
    const { data, error } = await signIn.emailOtpLink({
      email,
      otp: verificationCode,
    });
    console.log("emailSignIn result", { data, error });
    if (error === null) {
      //   setShowSuccess(true);
    }
    await pga.addMid({ encryptedMid: "fake-mid-1" });
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

      <div className="flex w-full flex-col items-center justify-between bg-black lg:w-1/2">
        <EmailLinkComponent emailSignIn={(args) => emailSignIn(args)} />
        {/* {showSuccess && !showConflict && <AccountConnectedSuccess />}
            {!showSuccess && showConflict && <AccountLinkingRequired />} */}
        {/* {showAccountConnect && (
              <AccountConnect
                connectGoogleFromWalletUser={connectGoogleFromWalletUser}
              />
            )} */}
        {/* <AuthForm /> */}
        {/* <AccountConnectedSuccess /> */}
        {/* <AuthSuccessScreen /> */}
        {/* <AccountLinkingRequired /> */}
        {/* <AccountConflictScreen /> */}
      </div>
      {/* Right section with login form */}
      {/* <LoginForm /> */}
      {/* <AccountConnectedSuccess /> */}
    </div>
  );
}

function EmailLinkComponent(props: any) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  return (
    <>
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-2 flex flex-col items-center">
          <svg
            className="h-12 w-12 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6.5C12 5.11929 14 3 18 3C18 6.5 16.5 10 12 10C7.5 10 6 6.5 6 3C10 3 12 5.11929 12 6.5Z"
              fill="currentColor"
            />
            <path
              d="M12 10C16.5 10 18 6.5 18 3C18 3 21.5 4 21.5 8.5C21.5 13 18 18 12 20.5C6 18 2.5 13 2.5 8.5C2.5 4 6 3 6 3C6 6.5 7.5 10 12 10Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="mt-2 text-2xl font-bold text-white">GuildPal</h2>
        </div>

        <p className="mb-8 text-center text-sm text-gray-400">
          Please enter your details to sign in your account.
        </p>

        {/* Login Form */}
        <div className="w-full space-y-4">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Please enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600"
              onClick={async () => {
                const { data, error } = await emailOtp.sendVerificationOtp({
                  email,
                  type: "sign-in", // or "email-verification", "forget-password"
                });
                console.log("sendVerificationOtp result", { data, error });
              }}
            >
              Verify Email
            </button>
          </div>

          {/* Verification Code Field */}
          <input
            type="text"
            className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <button
            className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600"
            onClick={() => props.emailSignIn({ email, verificationCode })}
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-900 p-4 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center">
          <span>© 2025 PGA Platform</span>
          <div className="mx-2 h-4 border-l border-gray-800"></div>
          <span>
            Do you need help with logging in?{" "}
            <a href="#" className="text-green-500 hover:underline">
              Support
            </a>
          </span>
        </div>
      </div>
    </>
  );
}
