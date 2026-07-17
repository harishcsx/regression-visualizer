import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regression Telemetry",
  description: "Advanced linear regression analysis tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="scan-overlay"></div>
        {children}
      </body>
    </html>
  );
}
