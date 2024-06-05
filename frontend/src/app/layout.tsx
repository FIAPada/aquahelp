import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Background from "../../public/background.png";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aquahelp",
  description: "Made to Snitch on those polluters!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Image
          src={Background}
          alt="background"
          className="w-screen h-screen absolute z-[-2]"
        />
        <div className="z-10">{children}</div>
      </body>
    </html>
  );
}
