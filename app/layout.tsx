import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { StoreProvide } from "@/utils/Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { FooterHome } from "@/component-home/footerHome/FooterHome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fredokaSans = Fredoka({
  variable: "--font-fredoka-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyShop Ecommerce website",
  description: "General shop application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredokaSans.variable}  antialiased`}
      >
        <SessionProvider refetchInterval={0}>
          <StoreProvide>
            {/*   <PayPalScriptProvider
              deferLoading={true}
              options={{
                clientId: process.env.PAYPAL_CLIENT_ID!,
                deferLoading: true,
              }}
            > */}
            <div className="flex flex-col min-h-[100vh] ">
              <div className="flex-1 ">{children}</div>
              <FooterHome />
            </div>
            {/*  </PayPalScriptProvider> */}
          </StoreProvide>
        </SessionProvider>
      </body>
    </html>
  );
}
