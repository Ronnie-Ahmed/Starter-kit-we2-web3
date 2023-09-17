import "./globals.css";
import { Orbitron } from "next/font/google";
import Navbar from "./components/Navbar";
import Provider from "./components/Provider";
import Thirdweb from "./components/Thirdweb";
import Footer from "./components/Footer";

const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata = {
  title: "E-Commerce APP",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const activeChain = "mumbai";

  return (
    <html lang="en">
      <body
        className={`${orbitron.className} bg-gradient-to-b from-gray-300 to-blue-900 text-white mx-auto px-4 py-4`}
      >
        <Thirdweb activeChain={activeChain} clientId={process.env.APIKEY}>
          <Provider>
            <Navbar />

            {children}
            <Footer />
          </Provider>
        </Thirdweb>
      </body>
    </html>
  );
}
