"use client";

import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import { useState, useEffect } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import Link from "next/link";
import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";
import { getProviders, signIn, useSession, signOut } from "next-auth/react";

import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { PolygonMumbai } from "@particle-network/chains";
import { contractAddress, contractABI } from "@/app/utils/constant";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [smartAccount, setSmartAccount] = useState(null);

  const [provider, setProvider] = useState(null);

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "6e198fd8-c681-4588-9e4e-13ff942dbb28",
    clientKey: "cyRPFVPsluk0UPvFgvO2DnKy68fNu8tYdfixW1d6",
    appId: "cbd878d5-dcac-4867-b90c-4c2ff38f060f",
    chainName: PolygonMumbai.name,
    chainId: PolygonMumbai.id,
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });

  const bundler = new Bundler({
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster = new BiconomyPaymaster({
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/80001/aDtrBQ4DF.0149553e-49d7-4faa-8e54-9203f2a372bc",
  });

  const connect = async () => {
    try {
      setLoading(true);
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      console.log({ particleProvider });
      const web3Provider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      setProvider(web3Provider);
      const biconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
      };
      let biconomySmartAccount = new BiconomySmartAccount(
        biconomySmartAccountConfig
      );
      biconomySmartAccount = await biconomySmartAccount.init();
      setAddress(await biconomySmartAccount.getSmartAccountAddress());
      setSmartAccount(biconomySmartAccount);
      setLoading(false);
      console.log(provider);
    } catch (error) {
      console.error(error);
    }
  };

  // const countnumber = async () => {
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(contractAddress, contractABI, signer);
  //   const minTx = await contract.incrementCount();
  //   const tx1 = {
  //     to: contractAddress,
  //     data: minTx.data,
  //   };
  //   let userOp = await smartAccount.buildUserOp([tx1]);
  //   console.log({ userOp });
  //   const biconomyPaymaster = smartAccount.paymaster;

  //   let paymasterServiceData = {
  //     mode: PaymasterMode.SPONSORED,
  //   };
  //   const paymasterAndDataResponse =
  //     await biconomyPaymaster.getPaymasterAndData(userOp, paymasterServiceData);

  //   userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
  //   const userOpResponse = await smartAccount.sendUserOp(userOp);
  //   console.log("userOpHash", userOpResponse);
  //   const { receipt } = await userOpResponse.wait(1);
  //   console.log("txHash", receipt.transactionHash);
  //   const newNumber = await contract.count();
  //   setCount(newNumber.toString());
  // };

  return (
    <div className="fixed top-0 left-0 right-0 mt-2">
      <div className="absolute inset-0 bg-blue-400 opacity-80 blur-md"></div>
      <div className="text-white py-4 px-6 md:px-12 flex items-center justify-between relative z-10">
        <Link href="/">
          <Image
            src="/next.svg"
            alt="Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        <nav className="flex space-x-4">
          <button
            className="text-red-900 hover:text-green-400 cursor-pointer"
            onClick={connect}
          >
            {provider === null ? "Login Wallet" : "Connected"}
          </button>
          <ConnectWallet />
          {status === "authenticated" ? (
            <div className="flex items-center space-x-4">
              <button
                className="text-red-900 hover:text-green-400 cursor-pointer"
                onClick={() => {
                  signOut();
                }}
              >
                SignOut
              </button>
              <div className="flex items-center">
                <Image
                  src={session.user.image}
                  alt="User Image"
                  width={25}
                  height={25}
                  className="object-contain rounded-full cursor-pointer"
                  onClick={() => {
                    signOut();
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              className="text-white hover:text-green-400 cursor-point"
              onClick={() => {
                signIn("google");
              }}
            >
              SignIn
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
