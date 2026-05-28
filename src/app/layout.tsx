import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, Anton_SC } from "next/font/google";
import "./globals.css";
import AppSetup from "./appSetup";
import "@radix-ui/themes/styles.css";
import BodyWrapper from "./bodyWrapper";
import InstallAppButton from "./pwa/install";
import Script from "next/script";
import type { Viewport } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const anton = Anton_SC({
  subsets: ["latin"],
  weight: ["400"], // Anton_SC only supports 400
  variable: "--font-anton",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Quiz Money",
    default: "Quiz Money - Rewarding Knowledge with Financial Income",
  },
  description: "Engage in quiz game and win amazing cash prices",
  generator: "Quiz Money",
  applicationName: "Quiz Money",
  keywords: ["Quiz Money", "make money online", "betting"],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://app.quizmoney.ng",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Quiz Money - Rewarding Knowledge with Financial Income",
    description: "Engage in quiz game and win amazing cash prices",
    url: "https://quizmoney.ng",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 1024,
        alt: "Quiz Money",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Money - Rewarding Knowledge with Financial Income",
    description: "Engage in quiz game and win amazing cash prices",
    images: ["/opengraph-image.png"],
  },
  robots: "index, follow",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1.0,
  //   minimumScale: 1.0,
  //   maximumScale: 1.0,
  //   userScalable: false,
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        ></link>
        <meta name="apple-mobile-web-app-title" content="Quiz Money" />
        <meta name="google-adsense-account" content="ca-pub-7047303023694178" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
        />

        {/* iOS-specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <Script id="adsense-init" strategy="afterInteractive">
          {`
        (function() {
          var ads = document.createElement("script");
          ads.async = true;
          ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7047303023694178";
          ads.crossOrigin = "anonymous";
          document.head.appendChild(ads);
        })();
      `}
        </Script>
      </head>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${anton.variable} antialiased`}
      >
        <BodyWrapper>
          <AppSetup>{children}</AppSetup>
        </BodyWrapper>
        <InstallAppButton />
      </body>
    </html>
  );
}
