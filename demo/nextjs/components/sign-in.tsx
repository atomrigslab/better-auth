// import { useState, useEffect } from 'react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [authStep, setAuthStep] = useState('email'); // 'email', 'otp', 'verified'
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [resendCount, setResendCount] = useState(0);
//   const [resendEnabled, setResendEnabled] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [autoLogin, setAutoLogin] = useState(false);

//   // Handle send/resend verification code
//   const handleVerifyEmail = () => {
//     if (!email || !email.includes('@')) return;
//     if (authStep === 'otp' && !resendEnabled) return;

//     // Simulate sending OTP
//     setOtpSent(true);
//     setAuthStep('otp');
//     setOtpTimer(60); // 1 minute timer
//     setResendEnabled(false);

//     if (authStep === 'otp') {
//       // If resending, increment the counter
//       setResendCount(prev => prev + 1);
//     }
//   };

//   // Handle sign in
//   const handleSignIn = () => {
//     if (verificationCode.length < 4) return;

//     // In a real app, you would verify the OTP here
//     setAuthStep('verified');
//     // Then redirect to the main app
//   };

//   // Timer effect
//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer(prev => prev - 1);
//       }, 1000);
//     } else if (otpTimer === 0 && authStep === 'otp') {
//       // When timer reaches zero, enable resend if under max attempts
//       if (resendCount < 3) {
//         setResendEnabled(true);
//       }
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer, authStep, resendCount]);

//   // Format timer to MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-black">
//       <div className="w-full max-w-sm space-y-6 p-6">
//         {/* Logo */}
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500">
//             <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-white">GuildPal</h1>
//         </div>

//         <p className="text-center text-gray-400">
//           Please enter your details to sign in your account.
//         </p>

//         {/* Auth steps indicator */}
//         {/* <div className="flex justify-center">
//           <div className="flex items-center space-x-2">
//             <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
//               authStep === 'email' ? 'bg-green-500 text-white' :
//               (authStep === 'otp' || authStep === 'verified') ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
//             }`}>
//               1
//             </div>
//             <div className={`h-1 w-6 ${
//               authStep === 'otp' || authStep === 'verified' ? 'bg-green-500' : 'bg-gray-700'
//             }`}></div>
//             <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
//               authStep === 'otp' ? 'bg-green-500 text-white' :
//               authStep === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
//             }`}>
//               2
//             </div>
//           </div>
//         </div> */}

//         {/* Auth form */}
//         <div className="space-y-4">
//           {/* Email field */}
//           <div>
//             <div className="relative">
//               <input
//                 type="email"
//                 className={`w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition-all ${
//                   authStep !== 'email' ? 'opacity-70' : ''
//                 }`}
//                 placeholder="Please enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={authStep !== 'email'}
//               />
//               <button
//                 onClick={handleVerifyEmail}
//                 disabled={!email || !email.includes('@') || (authStep === 'otp' && !resendEnabled)}
//                 className={`absolute right-2 top-1/2 -translate-y-1/2 rounded px-3 py-1 text-sm transition-all duration-200 ${
//                   email && email.includes('@') && (authStep === 'email' || resendEnabled)
//                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                     : 'bg-gray-700 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {authStep === 'email' ? 'Send' :
//                 //  otpTimer > 0 ? `Resend (${formatTime(otpTimer)})` :
//                  otpTimer > 0 ? `Resend` :
//                  resendCount >= 3 ? 'Max attempts' : 'Resend'}
//               </button>
//             </div>

//             {authStep === 'email' && email && !email.includes('@') && (
//               <p className="mt-1 text-xs text-red-500">Please enter a valid email</p>
//             )}

//           </div>

//           {/* OTP field */}
//           <div className={`transition-all duration-300 ${
//             authStep === 'email' ? 'opacity-50' : ''
//           }`}>
//             <div className="relative">
//               <input
//                 type="text"
//                 className={`w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition-all ${
//                   authStep === 'email' ? 'cursor-not-allowed' : ''
//                 }`}
//                 placeholder="Enter Verification Code"
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value)}
//                 disabled={authStep === 'email'}
//                 maxLength={6}
//               />
//               {/* Timer display in OTP field */}
//               {authStep === 'otp' && otpTimer > 0 && (
//                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                   {formatTime(otpTimer)}
//                 </div>
//               )}
//             </div>

//             {authStep === 'otp' && (
//               <div className="mt-1 flex items-center justify-between text-xs">
//                 <span className="text-gray-400">
//                   Enter the 6-digit code sent to your email
//                 </span>
//                 {resendCount > 0 && (
//                   <span className={`${resendCount >= 3 ? 'text-red-500' : 'text-gray-500'}`}>
//                     {resendCount}/3 resends
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Remember me & Auto login */}
//           <div className="flex justify-between">
//             <label className="flex items-center text-sm text-gray-400">
//               <input
//                 type="checkbox"
//                 className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               Remember Me
//             </label>

//             <label className="flex items-center text-sm text-gray-400">
//               <input
//                 type="checkbox"
//                 className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500"
//                 checked={autoLogin}
//                 onChange={() => setAutoLogin(!autoLogin)}
//               />
//               Auto Login
//             </label>
//           </div>

//           {/* Sign in button */}
//           <button
//             className={`w-full rounded py-3 font-medium text-white transition-all ${
//               authStep === 'otp' && verificationCode.length >= 4
//                 ? 'bg-green-500 hover:bg-green-600'
//                 : 'bg-gray-700 cursor-not-allowed'
//             }`}
//             disabled={authStep !== 'otp' || verificationCode.length < 4}
//             onClick={handleSignIn}
//           >
//             Sign in
//           </button>
//         </div>

//         {/* Divider */}
//         <div className="flex items-center">
//           <div className="flex-grow border-t border-gray-800"></div>
//           <span className="px-4 text-gray-500">or</span>
//           <div className="flex-grow border-t border-gray-800"></div>
//         </div>

//         {/* Social login buttons */}
//         <div className="space-y-3">
//           <button className="flex w-full items-center justify-center rounded border border-gray-700 bg-transparent py-3 text-white hover:bg-gray-800">
//             <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
//               ></path>
//             </svg>
//             Sign in with Google
//           </button>

//           {/* <button className="flex w-full items-center justify-center rounded border border-gray-700 bg-transparent py-3 text-white hover:bg-gray-800">
//             <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//             </svg>
//             Sign in with Facebook
//           </button> */}

//           <button className="flex w-full items-center justify-center rounded border border-gray-700 bg-transparent py-3 text-white hover:bg-gray-800">
//             <svg className="mr-2 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
//               {/* <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /> */}
//             </svg>
//             Sign in with Ronin Wallet
//           </button>

//           <button className="flex w-full items-center justify-center rounded border border-gray-700 bg-transparent py-3 text-white hover:bg-gray-800">
//             <svg className="mr-2 h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M16.434 1.51a1 1 0 00-.862-.51H8.429a1 1 0 00-.862.51L1.509 11.573a1 1 0 000 .854l6.058 10.062a1 1 0 001.723 0l2.712-4.505 2.712 4.505a1 1 0 001.723 0l6.058-10.062a1 1 0 000-.854L16.434 1.51z" />
//             </svg>
//             Sign in with Metamask
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="pt-4 text-center text-xs text-gray-500">
//           <p>© 2025 PGA Platform</p>
//           <p className="mt-1">
//             Do you need help with logging in? <a href="#" className="text-green-500 hover:underline">Support</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { emailOtp, signIn } from "@/lib/auth-client";
import { useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import { SiweMessage } from "siwe";

export default function Login() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

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
        <LoginForm />
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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  const emailSignIn = async () => {
    const { data, error } = await signIn.emailOtp({
      email,
      otp: verificationCode,
    });
    console.log("sendVerificationOtp result", { data, error });
  };

  const socialSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/sign-in",
    });
  };

  const roninSignIn = async () => {
    try {
      if (!window?.ronin?.provider) {
        alert("no ronin provider found");
        return;
      }

      const provider = new BrowserProvider(window?.ronin?.provider);
      const addresses = await provider.send("eth_requestAccounts", []);

      const scheme = window.location.protocol.slice(0, -1);
      const domain = window.location.host;
      const origin = window.location.origin;
      const address = ethers.getAddress(addresses[0]);

      const signer = await provider.getSigner();
      const nonce = await signIn.nonce({ address });
      if (nonce.error) {
        alert("fetching nonce failed");
        return;
      }

      const statement = "Sign in with Ethereum to the app.";
      const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: "1",
        nonce: nonce.data?.nonce,
        chainId: 1,
      });
      const messageToSign = message.prepareMessage();

      const signature = await signer.signMessage(messageToSign);
      console.log("signature and messageToSign", { signature, messageToSign });

      const result = await signIn.verify({
        message: messageToSign,
        signature,
        address,
      });
      console.log("result", result);
    } catch (error) {
      console.error(error);
    }
  };

  const metamaskSignIn = async () => {
    try {
      if (!window?.ethereum) {
        alert("no ethereum provider found");
        return;
      }
      if (!window?.ethereum?.isMetaMask) {
        alert("no metamask wallet found");
        return;
      }

      const provider = new BrowserProvider(window?.ethereum);
      const addresses = await provider.send("eth_requestAccounts", []);

      const scheme = window.location.protocol.slice(0, -1);
      const domain = window.location.host;
      const origin = window.location.origin;
      const address = ethers.getAddress(addresses[0]);

      const signer = await provider.getSigner();
      const nonce = await signIn.nonce({ address });
      if (nonce.error) {
        alert("fetching nonce failed");
        return;
      }

      const statement = "Sign in with Ethereum to the app.";
      const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: "1",
        nonce: nonce.data?.nonce,
        chainId: 1,
      });
      const messageToSign = message.prepareMessage();

      const signature = await signer.signMessage(messageToSign);
      console.log("signature and messageToSign", { signature, messageToSign });

      const result = await signIn.verify({
        message: messageToSign,
        signature,
        address,
      });
      console.log("result", result);
    } catch (error) {
      console.error(error);
    }
  };

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

          {/* Checkboxes */}
          {/* <div className="flex items-center justify-between px-1 text-sm">
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>

            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
                checked={autoLogin}
                onChange={() => setAutoLogin(!autoLogin)}
              />
              Auto Login
            </label>
          </div> */}

          {/* Sign In Button */}
          <button
            className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600"
            onClick={emailSignIn}
          >
            Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* Social Logins */}
          <button
            className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900"
            onClick={socialSignIn}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
              ></path>
            </svg>
            Sign in with Google
          </button>

          <button
            className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900"
            onClick={roninSignIn}
          >
            <svg
              className="mr-2 h-5 w-5 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
            </svg>
            Sign in with Ronin Wallet
          </button>

          <button
            className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900"
            onClick={metamaskSignIn}
          >
            <svg
              className="mr-2 h-5 w-5 text-orange-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M17.66 8.34a1 1 0 0 0-1.42 0L12 12.59l-4.24-4.24a1 1 0 0 0-1.42 1.41l4.95 4.95a1 1 0 0 0 1.42 0l4.95-4.95a1 1 0 0 0 0-1.42z" />
            </svg>
            Sign in with Metamask
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

function AuthSuccessScreen() {
  return (
    <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
      {/* Success Header */}
      <div className="bg-emerald-600 p-4 text-center">
        <h2 className="text-xl font-bold text-white">계정 연결 완료!</h2>
      </div>

      <div className="p-8 flex flex-col items-center">
        {/* Success Icon */}
        <div className="bg-gray-900 rounded-full w-20 h-20 flex items-center justify-center mb-6">
          <div className="bg-emerald-600 bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-white">PGA 계정이 성공적으로</p>
          <p className="text-xl font-bold text-white">연결되었습니다</p>
        </div>

        {/* Special Reward */}
        <div className="bg-gray-900 rounded-lg p-4 w-full mb-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-gray-900"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="font-bold text-yellow-500">축하합니다!</p>
              <p className="text-gray-400 text-sm">
                특별한 '알'을 획득했습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {}}
          className="bg-emerald-600 text-gray-900 font-bold py-3 px-6 rounded-full w-full transition-all hover:bg-emerald-500"
        >
          시작하기
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-gray-500 text-xs">
        © 2025 PGA Platform |{" "}
        <a href="#" className="text-emerald-500 hover:underline">
          Support
        </a>
      </div>
    </div>
  );
}

const AccountConflictScreen = () => {
  const [selectedOption, setSelectedOption] = useState("existingAccount");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    // onContinue(selectedOption);
  };

  return (
    <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
      {/* GuildPal Logo */}
      <div className="flex flex-col items-center mt-8 mb-4">
        <div className="w-10 h-10 relative">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path d="M12 6.5C12 5.11929 14 3 18 3C18 6.5 16.5 10 12 10C7.5 10 6 6.5 6 3C10 3 12 5.11929 12 6.5Z" />
            <path d="M12 10C16.5 10 18 6.5 18 3C18 3 21.5 4 21.5 8.5C21.5 13 18 18 12 20.5C6 18 2.5 13 2.5 8.5C2.5 4 6 3 6 3C6 6.5 7.5 10 12 10Z" />
          </svg>
        </div>
        <span className="font-bold text-white mt-1">GuildPal</span>
      </div>

      {/* Header */}
      <div className="bg-indigo-600 mx-6 rounded py-3 mb-4">
        <h2 className="text-center font-bold text-white">계정 연결 필요</h2>
      </div>

      {/* Message */}
      <div className="bg-white mx-6 rounded py-3 mb-6">
        <p className="text-center text-gray-700">
          이미 사용 중인 PGA 계정이 있습니다
        </p>
      </div>

      {/* PGA Logo */}
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 flex items-center justify-center">
          <span className="text-indigo-500 font-bold">PGA</span>
        </div>
      </div>

      {/* Info Text */}
      <div className="text-center mb-4">
        <p className="text-gray-400 text-sm">입력하신 PGA 계정은 이미 다른</p>
        <p className="text-gray-400 text-sm">
          GuildPal 계정과 연결되어 있습니다.
        </p>
      </div>

      {/* Options */}
      <div className="px-6 space-y-3 mb-6">
        {/* Option 1 */}
        <div
          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
            selectedOption === "existingAccount"
              ? "border-indigo-500 bg-gray-700"
              : "border-gray-600 bg-gray-800"
          }`}
          onClick={() => handleOptionChange("existingAccount")}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                selectedOption === "existingAccount"
                  ? "bg-indigo-600"
                  : "border border-gray-500"
              }`}
            >
              {selectedOption === "existingAccount" && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
            <div>
              <div className="text-white text-sm font-medium">
                기존 GuildPal 계정으로 로그인
              </div>
              <div className="text-gray-400 text-xs">
                이미 연결된 GuildPal 계정으로 로그인합니다
              </div>
            </div>
          </div>
        </div>

        {/* Option 2 */}
        <div
          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
            selectedOption === "newAccount"
              ? "border-indigo-500 bg-gray-700"
              : "border-gray-600 bg-gray-800"
          }`}
          onClick={() => handleOptionChange("newAccount")}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                selectedOption === "newAccount"
                  ? "bg-indigo-600"
                  : "border border-gray-500"
              }`}
            >
              {selectedOption === "newAccount" && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
            <div>
              <div className="text-gray-300 text-sm font-medium">
                현재 계정을 새 PGA 계정으로 사용
              </div>
              <div className="text-gray-400 text-xs">
                새 PGA 계정을 생성하여 연결합니다
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 mb-8">
        <button
          onClick={handleContinue}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full transition-all hover:bg-indigo-500"
        >
          계속하기
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-gray-500 text-xs">
        © 2025 PGA Platform |{" "}
        <a href="#" className="text-indigo-500 hover:underline">
          Support
        </a>
      </div>
    </div>
  );
};

// function AuthForm() {
//   const [email, setEmail] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [autoLogin, setAutoLogin] = useState(false);
//   // 추가: 회원가입에 필요한 필드
//   // const [name, setName] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   // 로그인 모드 또는 회원가입 모드 상태
//   const [isLogin, setIsLogin] = useState(true);

//   // 토글 함수
//   const toggleAuthMode = () => {
//     setIsLogin(!isLogin);
//     // 모드 변경 시 입력값 초기화
//     setVerificationCode("");
//     setRememberMe(false);
//     setAutoLogin(false);
//     // setAgreeTerms(false);
//   };

//   return (
//     <>
//       <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-8">
//         {/* Logo */}
//         <div className="mb-2 flex flex-col items-center">
//           <svg
//             className="h-12 w-12 text-white"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M12 6.5C12 5.11929 14 3 18 3C18 6.5 16.5 10 12 10C7.5 10 6 6.5 6 3C10 3 12 5.11929 12 6.5Z"
//               fill="currentColor"
//             />
//             <path
//               d="M12 10C16.5 10 18 6.5 18 3C18 3 21.5 4 21.5 8.5C21.5 13 18 18 12 20.5C6 18 2.5 13 2.5 8.5C2.5 4 6 3 6 3C6 6.5 7.5 10 12 10Z"
//               fill="currentColor"
//             />
//           </svg>
//           <h2 className="mt-2 text-2xl font-bold text-white">GuildPal</h2>
//         </div>

//         {/* 타이틀과 설명 - 로그인/회원가입에 따라 다르게 표시 */}
//         <p className="mb-8 text-center text-sm text-gray-400">
//           {isLogin
//             ? "Please enter your details to sign in your account."
//             : "Create a new account to join GuildPal."}
//         </p>

//         {/* Form */}
//         <div className="w-full space-y-4">
//           {/* 회원가입 모드에서만 이름 필드 표시 */}
//           {/* {!isLogin && (
//             <input
//               type="text"
//               className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
//               placeholder="Your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           )} */}

//           {/* Email Field */}
//           <div className="relative">
//             <input
//               type="email"
//               className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
//               placeholder="Please enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600">
//               Verify Email
//             </button>
//           </div>

//           {/* Verification Code Field */}
//           <input
//             type="text"
//             className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
//             placeholder="Enter Verification Code"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//           />

//           {/* 로그인 모드에서만 표시할 항목 */}
//           {isLogin && (
//             <div className="flex items-center justify-between px-1 text-sm">
//               <label className="flex items-center text-gray-400">
//                 <input
//                   type="checkbox"
//                   className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                 />
//                 Remember Me
//               </label>

//               <label className="flex items-center text-gray-400">
//                 <input
//                   type="checkbox"
//                   className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
//                   checked={autoLogin}
//                   onChange={() => setAutoLogin(!autoLogin)}
//                 />
//                 Auto Login
//               </label>
//             </div>
//           )}

//           {/* 회원가입 모드에서만 표시할 약관 동의 */}
//           {!isLogin && (
//             <label className="flex items-center px-1 text-sm text-gray-400">
//               <input
//                 type="checkbox"
//                 className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
//                 checked={agreeTerms}
//                 onChange={() => setAgreeTerms(!agreeTerms)}
//               />
//               I agree to the <a href="#" className="ml-1 text-green-500 hover:underline">Terms of Service</a> and <a href="#" className="ml-1 text-green-500 hover:underline">Privacy Policy</a>
//             </label>
//           )}

//           {/* Sign In/Sign Up Button */}
//           <button className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600">
//             {isLogin ? "Sign in" : "Create Account"}
//           </button>

//           {/* Auth Mode Toggle */}
//           <div className="text-center text-sm text-gray-400">
//             {isLogin ? (
//               <p>
//                 Don't have an account? <button onClick={toggleAuthMode} className="text-green-500 hover:underline">Sign up</button>
//               </p>
//             ) : (
//               <p>
//                 Already have an account? <button onClick={toggleAuthMode} className="text-green-500 hover:underline">Sign in</button>
//               </p>
//             )}
//           </div>

//           {/* Divider */}
//           <div className="flex items-center py-2">
//             <div className="flex-grow border-t border-gray-800"></div>
//             <span className="mx-4 text-gray-500">or</span>
//             <div className="flex-grow border-t border-gray-800"></div>
//           </div>

//           {/* Social Logins */}
//           <button className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900">
//             <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
//               ></path>
//             </svg>
//             {isLogin ? "Sign in with Google" : "Sign up with Google"}
//           </button>

//           <button className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900">
//             <svg
//               className="mr-2 h-5 w-5 text-blue-400"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
//             </svg>
//             {isLogin ? "Sign in with Ronin Wallet" : "Sign up with Ronin Wallet"}
//           </button>

//           <button className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900">
//             <svg
//               className="mr-2 h-5 w-5 text-orange-500"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//               <path d="M17.66 8.34a1 1 0 0 0-1.42 0L12 12.59l-4.24-4.24a1 1 0 0 0-1.42 1.41l4.95 4.95a1 1 0 0 0 1.42 0l4.95-4.95a1 1 0 0 0 0-1.42z" />
//             </svg>
//             {isLogin ? "Sign in with Metamask" : "Sign up with Metamask"}
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="w-full border-t border-gray-900 p-4 text-center text-xs text-gray-500">
//         <div className="flex items-center justify-center">
//           <span>© 2025 PGA Platform</span>
//           <div className="mx-2 h-4 border-l border-gray-800"></div>
//           <span>
//             Do you need help? {" "}
//             <a href="#" className="text-green-500 hover:underline">
//               Support
//             </a>
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// function AuthForm() {
//   const [email, setEmail] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [autoLogin, setAutoLogin] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // 이메일 인증 코드 전송 함수
//   const sendVerificationCode = async () => {
//     if (!email || !email.includes('@')) {
//       // 이메일 유효성 검사
//       alert('Please enter a valid email address');
//       return;
//     }

//     setLoading(true);

//     try {
//       // 실제 구현에서는 API 호출로 대체
//       // await api.sendVerificationCode(email);
//       console.log('Verification code sent to:', email);

//       setVerificationSent(true);
//       // 로딩 타이머 (데모용)
//       setTimeout(() => setLoading(false), 1000);
//     } catch (error) {
//       console.error('Error sending verification code:', error);
//       setLoading(false);
//     }
//   };

//   // 통합 로그인/가입 처리 함수
//   const handleAuth = async () => {
//     if (!email || !verificationCode) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     setLoading(true);

//     try {
//       // 실제 구현에서는 API 호출로 대체
//       // const response = await api.authenticate(email, verificationCode);

//       // 백엔드에서 다음과 같이 처리:
//       // 1. 이메일로 사용자 검색
//       // 2. 사용자가 존재하면 → 로그인 처리
//       // 3. 사용자가 존재하지 않으면 → 새 계정 생성 후 로그인 처리

//       console.log('Authentication successful for:', email);
//       console.log('User settings:', { rememberMe, autoLogin });

//       // 로딩 타이머 (데모용)
//       setTimeout(() => {
//         setLoading(false);
//         // 인증 성공 후 리디렉션
//         // window.location.href = '/dashboard';
//       }, 1500);
//     } catch (error) {
//       console.error('Authentication error:', error);
//       setLoading(false);
//     }
//   };

//   // 소셜/지갑 인증 처리 함수
//   const handleExternalAuth = (provider) => {
//     setLoading(true);

//     // 각 제공자별 인증 로직
//     console.log(`Authenticating with ${provider}`);

//     // 실제 구현에서는 각 제공자의 SDK/API 호출
//     setTimeout(() => {
//       setLoading(false);
//       // 성공 시 리디렉션
//       // window.location.href = '/dashboard';
//     }, 1500);
//   };

//   return (
//     <>
//       <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-8">
//         {/* Logo */}
//         <div className="mb-2 flex flex-col items-center">
//           <svg
//             className="h-12 w-12 text-white"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M12 6.5C12 5.11929 14 3 18 3C18 6.5 16.5 10 12 10C7.5 10 6 6.5 6 3C10 3 12 5.11929 12 6.5Z"
//               fill="currentColor"
//             />
//             <path
//               d="M12 10C16.5 10 18 6.5 18 3C18 3 21.5 4 21.5 8.5C21.5 13 18 18 12 20.5C6 18 2.5 13 2.5 8.5C2.5 4 6 3 6 3C6 6.5 7.5 10 12 10Z"
//               fill="currentColor"
//             />
//           </svg>
//           <h2 className="mt-2 text-2xl font-bold text-white">GuildPal</h2>
//         </div>

//         <p className="mb-8 text-center text-sm text-gray-400">
//           Please enter your details to continue with GuildPal.
//         </p>

//         {/* Auth Form */}
//         <div className="w-full space-y-4">
//           {/* Email Field */}
//           <div className="relative">
//             <input
//               type="email"
//               className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
//               placeholder="Please enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading || verificationSent}
//             />
//             <button
//               onClick={sendVerificationCode}
//               disabled={loading || verificationSent}
//               className={`absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white
//                 ${verificationSent ? 'bg-green-700 cursor-default' : 'bg-gray-700 hover:bg-gray-600'}`}
//             >
//               {verificationSent ? 'Sent' : loading ? 'Sending...' : 'Verify Email'}
//             </button>
//           </div>

//           {/* Verification Code Field */}
//           <input
//             type="text"
//             className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
//             placeholder="Enter Verification Code"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             disabled={loading || !verificationSent}
//           />

//           {/* Checkboxes */}
//           <div className="flex items-center justify-between px-1 text-sm">
//             <label className="flex items-center text-gray-400">
//               <input
//                 type="checkbox"
//                 className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 disabled={loading}
//               />
//               Remember Me
//             </label>

//             <label className="flex items-center text-gray-400">
//               <input
//                 type="checkbox"
//                 className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-0 focus:ring-offset-0"
//                 checked={autoLogin}
//                 onChange={() => setAutoLogin(!autoLogin)}
//                 disabled={loading}
//               />
//               Auto Login
//             </label>
//           </div>

//           {/* Continue Button */}
//           <button
//             onClick={handleAuth}
//             disabled={loading || !verificationSent}
//             className={`w-full rounded py-3 font-medium text-white
//               ${loading ? 'bg-gray-600' : verificationSent ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600'}`}
//           >
//             {loading ? 'Processing...' : 'Continue'}
//           </button>

//           {/* Divider */}
//           <div className="flex items-center py-2">
//             <div className="flex-grow border-t border-gray-800"></div>
//             <span className="mx-4 text-gray-500">or</span>
//             <div className="flex-grow border-t border-gray-800"></div>
//           </div>

//           {/* Social Logins */}
//           <button
//             onClick={() => handleExternalAuth('Google')}
//             disabled={loading}
//             className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900 disabled:opacity-50"
//           >
//             <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
//               ></path>
//             </svg>
//             Continue with Google
//           </button>

//           <button
//             onClick={() => handleExternalAuth('Ronin')}
//             disabled={loading}
//             className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900 disabled:opacity-50"
//           >
//             <svg
//               className="mr-2 h-5 w-5 text-blue-400"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
//             </svg>
//             Continue with Ronin Wallet
//           </button>

//           <button
//             onClick={() => handleExternalAuth('Metamask')}
//             disabled={loading}
//             className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900 disabled:opacity-50"
//           >
//             <svg
//               className="mr-2 h-5 w-5 text-orange-500"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//               <path d="M17.66 8.34a1 1 0 0 0-1.42 0L12 12.59l-4.24-4.24a1 1 0 0 0-1.42 1.41l4.95 4.95a1 1 0 0 0 1.42 0l4.95-4.95a1 1 0 0 0 0-1.42z" />
//             </svg>
//             Continue with Metamask
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="w-full border-t border-gray-900 p-4 text-center text-xs text-gray-500">
//         <div className="flex items-center justify-center">
//           <span>© 2025 PGA Platform</span>
//           <div className="mx-2 h-4 border-l border-gray-800"></div>
//           <span>
//             Do you need help? {" "}
//             <a href="#" className="text-green-500 hover:underline">
//               Support
//             </a>
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// import React from 'react';

function AccountConnectedSuccess() {
  return (
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
          <button className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600">
            시작하기
          </button>
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
  );
}

// import React, { useState } from 'react';

function AccountLinkingRequired() {
  const [selectedOption, setSelectedOption] = useState("existing"); // 'existing' 또는 'new'

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center px-8">
      {/* Logo */}
      {/* <div className="mb-6 flex flex-col items-center">
        <svg
          className="h-12 w-12 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <h2 className="mt-2 text-2xl font-bold text-white">GuildPal</h2>
      </div> */}

      {/* Account linking card */}
      <div className="overflow-hidden rounded-lg bg-white">
        {/* Header */}
        <div className="bg-indigo-500 py-4 text-center text-lg font-semibold text-white">
          계정 연결 필요
        </div>

        {/* Content */}
        <div className="flex flex-col p-6">
          <p className="mb-4 text-center text-gray-800">
            이미 사용 중인 PGA 계정이 있습니다
          </p>

          {/* PGA Logo */}
          <div className="my-4 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <span className="text-lg font-bold text-indigo-600">PGA</span>
              </div>
            </div>
          </div>

          <p className="mb-6 text-center text-sm text-gray-600">
            입력하신 PGA 계정은 이미 다른 GuildPal 계정과 연결되어 있습니다.
          </p>

          {/* Option 1 */}
          <div
            className={`mb-3 flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
              selectedOption === "existing"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() => handleOptionSelect("existing")}
          >
            <div>
              <p className="font-medium text-gray-800">
                기존 GuildPal 계정으로 로그인
              </p>
              <p className="text-sm text-gray-600">
                이미 연결된 GuildPal 계정으로 로그인합니다.
              </p>
            </div>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                selectedOption === "existing"
                  ? "border-indigo-500 bg-indigo-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedOption === "existing" && (
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Option 2 */}
          <div
            className={`mb-6 flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
              selectedOption === "new"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() => handleOptionSelect("new")}
          >
            <div>
              <p className="font-medium text-gray-800">
                현재 계정을 새 PGA 계정으로 사용
              </p>
              <p className="text-sm text-gray-600">
                새 PGA 계정을 생성하여 연결합니다.
              </p>
            </div>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                selectedOption === "new"
                  ? "border-indigo-500 bg-indigo-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedOption === "new" && (
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Continue button */}
          <button className="w-full rounded-full bg-indigo-500 py-3 font-medium text-white hover:bg-indigo-600">
            계속하기
          </button>
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
  );
}
