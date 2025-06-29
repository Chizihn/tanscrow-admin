import { Providers } from "@/components/Providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanscrow Admin Dashboard",
  description: "Tanscrow Admin Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <div className="min-h-screen bg-background">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
