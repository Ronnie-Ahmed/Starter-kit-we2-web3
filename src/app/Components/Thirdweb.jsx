"use client";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  smartWallet,
  paperWallet,
} from "@thirdweb-dev/react";

const Thirdweb = ({ children }) => {
  const activeChain = "mumbai";
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.APIKEY}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        smartWallet({
          factoryAddress: process.env.SMART_WALLET_FACTORY_ADDRESS,
          gasless: true,
          personalWallets: [
            metamaskWallet(),
            coinbaseWallet(),
            walletConnect(),
          ],
        }),
        localWallet({
          persist: true,
        }),
        paperWallet({
          paperClientId: process.env.NEXT_PUBLIC_PAPER_CLIENT_ID,
          persist: true,
        }),
      ]}
    >
      {children}
    </ThirdwebProvider>
  );
};
export default Thirdweb;
