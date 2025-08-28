import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import Script from "next/script";

const spacegrotesk = Space_Grotesk({
  variable: "--spacegrotesk",
  subsets: ["latin"],
});

const dmsans = DM_Sans({
  variable: "--dmsans",
  subsets: ["latin"],
});

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
        className={`${spacegrotesk.variable} ${dmsans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
