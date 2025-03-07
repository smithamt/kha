import { getUser } from "@/auth/user";
import sequelize from "@/lib/mysql";
import Bill from "@/models/bill";
import Client from "@/models/client";
import TableColumn from "@/models/column";
import Device from "@/models/devices";
import TrashModel from "@/models/trashes";
import UpdateModel from "@/models/updated";
import User from "@/models/user";
import Visitor from "@/models/visitior";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import { CustomQueryClientProvider } from "./contexts/tanstack";
import { HasUserProvider } from "./contexts/user";
import { VisitorProvider } from "./contexts/visitor";
import "./globals.css";
import Login from "./login/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const helveticaNeueRoman = localFont({
  src: "./fonts/HelveticaNeueRoman.woff",
  variable: "--font-helvetica-roman",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Starlink",
  description: "Generated by create next app",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  try {
    sequelize
      .sync({ alter: true })
      .catch((error) => console.log("sync error", error));
  } catch (error) {}

  User.count({ where: { is_public: true } }).catch((err) =>
    console.log("error")
  );
  Client.count({ where: { is_public: true } }).catch((err) =>
    console.log("error")
  );
  Device.count({ where: { is_public: true } }).catch((err) =>
    console.log("error")
  );
  Bill.count({ where: { is_public: true } }).catch((err) =>
    console.log("error")
  );
  TableColumn.count({ where: { is_public: true } }).catch((err) =>
    console.log("error")
  );
  Visitor.count().catch((err) => console.log("error"));
  TrashModel.count().catch((err) => console.log("error"));
  UpdateModel.count().catch((err) => console.log("error"));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${helveticaNeueRoman.variable} antialiased h-screen`}
      >
        <VisitorProvider>
          {user ? (
            <HasUserProvider user={JSON.stringify(user)}>
              <CustomQueryClientProvider>{children}</CustomQueryClientProvider>
            </HasUserProvider>
          ) : (
            <>
              <Image
                src={"/starlink.jpg"}
                fill
                alt="background"
                className="object-cover"
              />
              <Login searchParams={{}} />;
            </>
          )}
        </VisitorProvider>
      </body>
    </html>
  );
}
