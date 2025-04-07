import { client, emailOtp, pga, signIn } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import { SiweMessage } from "siwe";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  useEffect(() => {
    // fetchPgaUser();
  }, []);

  // const fetchPgaUser = async () => {
  //   const pgaUser = await pga.getUserByMid({
  //     query: { encryptedMid: "fake-mid-1" },
  //   });
  //   if (pgaUser.error) return;
  //   setPgaUser(pgaUser?.data);
  // };

  const emailSignIn = async (args: {
    email: string;
    verificationCode: string;
  }) => {
    const { email, verificationCode } = args;
    const { data, error } = await signIn.emailOtp({
      email,
      otp: verificationCode,
    });
    if (error) {
      setLoginError(`Sign in failed: ${error.message}`);
      return;
    }
    client.getSession().then((session) => {
      if (session.error) return;
      window.pga.helpers.setAuthToken(session.data);
      pga.addMid({ encryptedMid: "fake-mid-1" });
    });

    const url = new URL("/sign-in-success", window.location.origin);
    url.searchParams.set("login_method", "email");

    router.push(url.toString());
  };

  const socialSignIn = async () => {
    const signInResult = await signIn.social({
      provider: "google",
      callbackURL: "/sign-in-success?login_method=google",
    });

    // window.pga.helpers.setAuthToken(JSON.parse(storedToken));
    await pga.addMid({ encryptedMid: "fake-mid-2" });
  };

  const roninSignIn = async () => {
    setIsLoading(true);
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

      // const statement = "Sign in with Ethereum to the app.";
      const statement =
        "By signing this message, you are authenticating with GuildPal.";
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

      const result = await signIn.verify({
        message: messageToSign,
        signature,
        address,
        walletName: "ronin",
      });

      const session = await client.getSession();
      if (session.error) return;
      window.pga.helpers.setAuthToken(session.data);
      pga.addMid({ encryptedMid: "fake-mid-1" });

      const url = new URL("/sign-in-success", window.location.origin);
      url.searchParams.set("login_method", "ronin");

      router.push(url.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const metamaskSignIn = async () => {
    setIsLoading(true);
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
        walletName: "metamask",
      });
      console.log("result", result);

      const session = await client.getSession();
      console.log("sign-in session", session);
      if (session.error) return;
      window.pga.helpers.setAuthToken(session.data);
      pga.addMid({ encryptedMid: "fake-mid-1" });

      const url = new URL("/sign-in-success", window.location.origin);
      url.searchParams.set("login_method", "metamask");

      router.push(url.toString());

      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center rounded-lg bg-gray-900 p-6 shadow-lg">
            <svg
              className="animate-spin h-12 w-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-lg font-medium text-white">Connecting...</p>
          </div>
        </div>
      )}
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
          {/* {!showSuccess && ( */}
          <LoginForm
            emailSignIn={(args) => emailSignIn(args)}
            // emailSignIn={(args) => emailSignInLink(args)}
            socialSignIn={socialSignIn}
            roninSignIn={roninSignIn}
            metamaskSignIn={metamaskSignIn}
            loginError={loginError}
          />
        </div>
      </div>
    </>
  );
}

function LoginForm(props: any) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      setIsVerifyButtonDisabled(true);
      const { data, error } = await emailOtp.sendVerificationOtp({
        email,
        type: "sign-in", // or "email-verification", "forget-password"
      });
      if (error) {
        return setEmailError(error?.message);
      }
      setIsVerificationSent(true);
      setIsVerifyButtonDisabled(true);
      console.log("sendVerificationOtp result", { data, error });
    } catch (error) {
      console.error(error);
      setIsVerifyButtonDisabled(false);
    } finally {
      //
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
            {/* <input
              type="email"
              className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Please enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}
            <input
              type="email"
              className={`w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500 ${
                emailError ? "border border-red-500" : ""
              }`}
              placeholder="Please enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(""); // Clear error on change
              }}
              // disabled={isVerifyButtonDisabled && countdown > 0}
            />
            <button
              // className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600"
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white ${
                isVerifyButtonDisabled
                  ? "bg-gray-500 opacity-50 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={isVerifyButtonDisabled}
              onClick={sendVerificationOtp}
            >
              Verify Email
            </button>
          </div>
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          {isVerificationSent && !emailError && (
            <p className="text-green-500 text-sm">
              Verification code sent! Please check your email.
            </p>
          )}

          <input
            type="text"
            className="w-full rounded bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <button
            className="w-full rounded bg-green-500 py-3 font-medium text-white hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed"
            onClick={() => props.emailSignIn({ email, verificationCode })}
            disabled={!isVerificationSent || !verificationCode.trim()}
          >
            Sign in
          </button>

          {props.loginError && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded">
              <p className="text-red-500 text-sm">{props.loginError}</p>
            </div>
          )}

          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <button
            className="flex w-full items-center justify-center rounded border border-gray-800 py-3 text-white hover:bg-gray-900"
            onClick={() => props.socialSignIn()}
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
            onClick={() => props.roninSignIn()}
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
            onClick={() => props.metamaskSignIn()}
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
