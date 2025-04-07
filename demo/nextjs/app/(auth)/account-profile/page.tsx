"use client";

import { auth } from "@/lib/auth";
import { client, linkSocial, pga, signIn, signOut } from "@/lib/auth-client";
import { BrowserProvider, ethers } from "ethers";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";

export default function Page() {
  const [linked, setLinked] = useState({
    email: false,
    social: {
      google: false,
    },
    wallet: {
      ronin: {
        linked: false,
        address: "",
      },
      metamask: {
        linked: false,
        address: "",
      },
    },
  });
  const [pgaUser, setPgaUser] = useState({});
  const [session, setSession] = useState();

  const router = useRouter();

  useEffect(() => {
    fetchPgaUser();
  }, []);

  const fetchPgaUser = async () => {
    const s = await client.getSession();
    console.log("getSession result", s);
    setSession(s);
    const result = await pga.getUserByMid({
      query: { encryptedMid: "fake-mid-1" },
    });
    console.log("getUserByMid result", result);
    if (result.error) {
      return;
    }
    // console.log("dd", !!result?.data?.accounts?.find((a) => a.providerId === "google"))
    setPgaUser(result.data);

    const isEmailLinked =
      !!result?.data?.user && !!result?.data?.user?.emailVerified;
    const isGoogleLinked =
      result?.data?.user &&
      Array.isArray(result?.data?.accounts) &&
      !!result?.data?.accounts?.find((a) => a.providerId === "google");

    const roninWallet = s.data.wallet.find((w) => w.name === "ronin");
    const metamaskWallet = s.data.wallet.find((w) => w.name === "metamask");

    setLinked({
      email: isEmailLinked,
      social: {
        google: isGoogleLinked as boolean,
      },
      wallet: {
        ronin: {
          linked: !!roninWallet,
          address: roninWallet?.address,
        },
        metamask: {
          linked: !!metamaskWallet,
          address: metamaskWallet?.address,
        },
      },
    });
  };

  const routeToConnectEmail = async () => {
    router.push("/email-link");
  };

  const connectGoogle = async () => {
    await linkSocial({
      provider: "google", // Provider to link
      callbackURL: "/link-success",
    });
    fetchPgaUser();
  };

  const connectWallet = async (walletName: "ronin" | "metamask") => {
    try {
      if (!walletName) {
        alert("no walletName found");
        return;
      }
      let p;
      if (walletName === "ronin") {
        p = window?.ronin?.provider;
      } else if (walletName === "metamask") {
        p = window?.ethereum;
      }

      const provider = new BrowserProvider(p);
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

      const result = await signIn.walletLink({
        message: messageToSign,
        signature,
        address,
        walletName,
      });
      console.log("result", result);

      //   await pga.addMid({ encryptedMid: "fake-mid-1" });
      console.log("add mid success");

      fetchPgaUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess() {
          router.push("/sign-in");
        },
      },
    });
  };

  if (!session) {
    return <span>...</span>;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Left side with gradient background and welcome message */}
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

      {/* Right side with account management */}
      <div className="w-1/2 bg-gray-900 p-16 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center text-green-400">
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM8 9H16V19H8V9Z"
                fill="currentColor"
              />
              <path
                d="M4 17H2V5C2 3.9 2.9 3 4 3H16V5H4V17Z"
                fill="currentColor"
              />
              <circle cx="12" cy="15" r="2" fill="currentColor" />
            </svg>
            <span className="text-xl font-semibold">GuildPal</span>
            <span className="text-xl text-gray-300 ml-4">Manage Account</span>
          </div>
          {/* Sign Out Button added to header */}
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Sign Out
          </button>
        </div>

        {/* Profile Settings */}
        <div className="mb-6">
          <h2 className="text-white text-lg mb-4 text-center">
            Profile Settings
          </h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Your E-mail</p>
                {linked.email ? (
                  <p className="text-gray-300">{pgaUser?.user?.email}</p>
                ) : (
                  <p className="text-gray-300"></p>
                )}
              </div>
              {!linked.email ? (
                <button
                  className="bg-transparent text-green-400 px-2 py-1 rounded text-sm"
                  onClick={routeToConnectEmail}
                >
                  Connect +
                </button>
              ) : (
                <span className="bg-transparent text-green-600 px-2 py-1 rounded text-sm">
                  Linked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SNS & Wallet Connections */}
        <div className="mb-6">
          <h2 className="text-white text-lg mb-4 text-center">
            SNS & Wallet Connections
          </h2>

          {/* Google */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Google</p>
                  {/* <p className="text-green-400 text-sm">PGA123@gmail.com</p> */}
                  {linked.social.google ? (
                    <p className="text-green-400 text-sm">
                      {pgaUser?.user?.email}
                    </p>
                  ) : (
                    <p className="text-green-400 text-sm"></p>
                  )}
                </div>
              </div>
              {!linked.social.google ? (
                <button
                  className="bg-transparent text-green-400 px-2 py-1 rounded text-sm"
                  onClick={connectGoogle}
                >
                  Connect +
                </button>
              ) : (
                <span className="bg-transparent text-green-600 px-2 py-1 rounded text-sm">
                  Linked
                </span>
              )}
              {/* <span className="text-gray-400 text-sm">Connection</span> */}
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
                  {linked.wallet.ronin.linked ? (
                    <p className="text-green-400 text-sm">
                      {/* {pgaUser?.user?.address.slice(0, 8)}... */}
                      {linked.wallet.ronin.address.slice(0, 8)}...
                    </p>
                  ) : (
                    <p className="text-green-400 text-sm"></p>
                  )}
                </div>
              </div>
              {!linked.wallet.ronin.linked ? (
                <button
                  className="bg-transparent text-green-400 px-2 py-1 rounded text-sm"
                  onClick={() => connectWallet("ronin")}
                >
                  Connect +
                </button>
              ) : (
                <span className="bg-transparent text-green-600 px-2 py-1 rounded text-sm">
                  Linked
                </span>
              )}
            </div>
          </div>

          {/* Metamask Wallet */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center text-orange-500">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.4 0L13.1 7.7L14.6 3.5L21.4 0Z"
                      fill="#E17726"
                    />
                    <path d="M2.6 0L10.8 7.8L9.4 3.5L2.6 0Z" fill="#E27625" />
                    <path
                      d="M18.7 17.2L16.5 21.2L21.1 22.7L22.4 17.3L18.7 17.2Z"
                      fill="#E27625"
                    />
                    <path
                      d="M1.6 17.3L2.9 22.7L7.5 21.2L5.3 17.2L1.6 17.3Z"
                      fill="#E27625"
                    />
                    <path
                      d="M7.3 10.6L6 13L10.5 13.2L10.3 8.3L7.3 10.6Z"
                      fill="#E27625"
                    />
                    <path
                      d="M16.7 10.6L13.7 8.2L13.5 13.2L18 13L16.7 10.6Z"
                      fill="#E27625"
                    />
                    <path
                      d="M7.5 21.2L10.2 19.6L7.9 17.3L7.5 21.2Z"
                      fill="#E27625"
                    />
                    <path
                      d="M13.8 19.6L16.5 21.2L16.1 17.3L13.8 19.6Z"
                      fill="#E27625"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Metamask Wallet</p>
                  {linked.wallet.metamask.linked ? (
                    <p className="text-green-400 text-sm">
                      {/* {pgaUser?.user?.address.slice(0, 8)}... */}
                      {linked.wallet.metamask.address.slice(0, 8)}...
                    </p>
                  ) : (
                    <p className="text-green-400 text-sm"></p>
                  )}
                </div>
              </div>
              {/* <button
                className="bg-transparent text-green-400 px-2 py-1 rounded text-sm"
                onClick={() => connectWallet("metamask")}
              >
                Connect +
              </button> */}
              {!linked.wallet.metamask.linked ? (
                <button
                  className="bg-transparent text-green-400 px-2 py-1 rounded text-sm"
                  onClick={() => connectWallet("metamask")}
                >
                  Connect +
                </button>
              ) : (
                <span className="bg-transparent text-green-600 px-2 py-1 rounded text-sm">
                  Linked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center text-sm">
          <p className="text-gray-500">© 2025 PGA Platform</p>
          <div className="flex items-center">
            <p className="text-gray-500 mr-2">
              Do you need help with logging in?
            </p>
            <a href="#" className="text-white underline">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";

// const AccountManagementPage = () => {
//   // Mock state
//   const [linked, setLinked] = useState({
//     email: false,
//     social: {
//       google: true,
//       facebook: false,
//     },
//     wallet: {
//       ronin: false,
//       metamask: false,
//     },
//   });

//   return (
//     <div className="flex h-screen w-screen bg-black">
//       {/* Header with GuildPal logo - centered on page */}
//       {/* Left section with gradient background */}
//       <div className="relative hidden w-1/2 lg:block">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-600 to-green-400 opacity-90">
//           {/* Blob shapes overlay */}
//           <div className="absolute bottom-0 left-0 h-4/5 w-4/5 rounded-full bg-blue-500/30 blur-3xl"></div>
//           <div className="absolute right-0 top-1/3 h-4/5 w-4/5 rounded-full bg-green-500/30 blur-3xl"></div>
//         </div>
//         <div className="relative z-10 flex h-full flex-col justify-center p-16 text-white">
//           <h1 className="text-6xl font-bold leading-tight">
//             Welcome
//             <br />
//             Back to GuilPal.
//           </h1>
//           <p className="mt-6 text-xl">A new quest begins now. Are you in?</p>
//         </div>
//       </div>

//       {/* Main content - centered container */}
//       {/* <div className="mx-auto max-w-md space-y-6 px-4"> */}
//       <div className="w-full lg:w-1/2">
//         {/* Profile Settings Box */}
//         <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
//           <h2 className="mb-4 text-center text-xl font-semibold text-white">
//             Profile Settings
//           </h2>
//           <div className="rounded-lg bg-gray-800 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-white">Your E-mail</p>
//                 <p className="text-gray-400">-</p>
//               </div>
//               <button className="text-sm font-medium text-green-400 hover:text-green-300">
//                 Connect +
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SNS & Wallet Connections Box */}
//         <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
//           <h2 className="mb-4 text-center text-xl font-semibold text-white">
//             SNS & Wallet Connections
//           </h2>

//           {/* Google */}
//           <div className="mb-4 rounded-lg bg-gray-800 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="mr-3"
//                 >
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     fill="#EA4335"
//                   />
//                 </svg>
//                 <div>
//                   <p className="font-medium text-white">Google</p>
//                   <p className="text-sm text-green-400">PGA123@gmail.com</p>
//                 </div>
//               </div>
//               <span className="text-sm text-gray-400">Connection</span>
//             </div>
//           </div>

//           {/* Facebook */}
//           <div className="mb-4 rounded-lg bg-gray-800 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="mr-3 rounded-full bg-blue-600 p-1">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M16.6 15.4L17.1 12H13.9V9.8C13.9 8.8 14.3 7.8 16 7.8H17.3V4.9C17.3 4.9 15.8 4.6 14.4 4.6C11.4 4.6 9.5 6.4 9.5 9.4V12H6.6V15.4H9.5V23.9C10.2 24 11 24.1 11.8 24.1C12.5 24.1 13.3 24 14 23.9V15.4H16.6Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium text-white">Facebook</p>
//                   <p className="text-sm text-gray-400">-</p>
//                 </div>
//               </div>
//               <button className="text-sm font-medium text-green-400 hover:text-green-300">
//                 Connect +
//               </button>
//             </div>
//           </div>

//           {/* Ronin Wallet */}
//           <div className="mb-4 rounded-lg bg-gray-800 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
//                   <span className="text-sm font-bold text-white">R</span>
//                 </div>
//                 <div>
//                   <p className="font-medium text-white">Ronin Wallet</p>
//                   <p className="text-sm text-gray-400">-</p>
//                 </div>
//               </div>
//               <button className="text-sm font-medium text-green-400 hover:text-green-300">
//                 Connect +
//               </button>
//             </div>
//           </div>

//           {/* Metamask Wallet */}
//           <div className="rounded-lg bg-gray-800 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="mr-3">
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M21.4 0L13.1 7.7L14.6 3.5L21.4 0Z"
//                       fill="#E17726"
//                     />
//                     <path d="M2.6 0L10.8 7.8L9.4 3.5L2.6 0Z" fill="#E27625" />
//                     <path
//                       d="M18.7 17.2L16.5 21.2L21.1 22.7L22.4 17.3L18.7 17.2Z"
//                       fill="#E27625"
//                     />
//                     <path
//                       d="M1.6 17.3L2.9 22.7L7.5 21.2L5.3 17.2L1.6 17.3Z"
//                       fill="#E27625"
//                     />
//                     <path
//                       d="M7.3 10.6L6 13L10.5 13.2L10.3 8.3L7.3 10.6Z"
//                       fill="#E27625"
//                     />
//                     <path
//                       d="M16.7 10.6L13.7 8.2L13.5 13.2L18 13L16.7 10.6Z"
//                       fill="#E27625"
//                     />
//                     <path
//                       d="M7.5 21.2L10.2 19.6L7.9 17.3L7.5 21.2Z"
//                       fill="#E27625"
//                     />
//                     <path
//                       d="M13.8 19.6L16.5 21.2L16.1 17.3L13.8 19.6Z"
//                       fill="#E27625"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium text-white">Metamask Wallet</p>
//                   <p className="text-sm text-gray-400">-</p>
//                 </div>
//               </div>
//               <button className="text-sm font-medium text-green-400 hover:text-green-300">
//                 Connect +
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-auto flex w-full flex-col items-center justify-between p-4 py-6 text-sm sm:flex-row sm:px-8">
//         <p className="text-gray-500">© 2025 PGA Platform</p>
//         <div className="mt-2 flex items-center sm:mt-0">
//           <p className="mr-2 text-gray-500">
//             Do you need help with logging in?
//           </p>
//           <a href="#" className="font-medium text-white underline">
//             Support
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountManagementPage;
