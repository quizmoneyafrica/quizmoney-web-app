"use client";
import Script from "next/script";

const GoogleAdSense = () => {
  return (
    <Script
      id="adsense-script"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7047303023694178"
      crossOrigin="anonymous"
    />
  );
};

export default GoogleAdSense;
