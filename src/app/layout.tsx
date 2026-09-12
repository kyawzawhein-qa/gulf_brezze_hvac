import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/cms";
import { designToCssVars } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSiteContent();
    return {
      title: `${content.settings.brandName} | 24/7 Emergency AC — Lee County, FL (Demo)`,
      description: content.settings.footerBlurb,
      robots: { index: false, follow: false },
      icons: {
        icon: content.settings.logoMarkPath || "/brand/logo-mark.svg",
      },
    };
  } catch {
    return {
      title: "Gulf Breeze HVAC | 24/7 Emergency AC — Lee County, FL (Demo)",
      robots: { index: false, follow: false },
      icons: { icon: "/brand/logo-mark.svg" },
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cssVars = "";
  try {
    const content = await getSiteContent();
    cssVars = designToCssVars(content.design);
  } catch {
    cssVars = "";
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gb-sand text-gb-navy">
        {cssVars ? <style dangerouslySetInnerHTML={{ __html: `:root{${cssVars}}` }} /> : null}
        {children}
      </body>
    </html>
  );
}
