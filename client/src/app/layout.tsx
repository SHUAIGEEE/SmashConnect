import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/../auth";
import Providers from "@/components/layout/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmashConnect",
  description:
    "Badminton Beyond Boundaries: Crafted for Seamless Community Engagement"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <ApolloWrapper>{children}</ApolloWrapper>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
