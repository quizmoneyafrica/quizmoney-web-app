/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      maximize: () => void;
      [key: string]: any;
    };
  }
}

const useTawkHidden = (onTawkLoad?: () => void) => {
  useEffect(() => {
    if (document.getElementById("tawk-script")) return;

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/68428acad7b1f2190a47426f/1it1usa0o";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.id = "tawk-script";
    document.body.appendChild(script);

    script.onload = () => {
      const checkReady = setInterval(() => {
        if (window.Tawk_API?.hideWidget) {
          window.Tawk_API.hideWidget();
          clearInterval(checkReady);
          if (onTawkLoad) onTawkLoad(); // Notify that Tawk is ready
        }
      }, 300);
    };

    return () => {
      const tawkScript = document.getElementById("tawk-script");
      if (tawkScript) tawkScript.remove();

      const iframe = document.querySelector("iframe[src*='tawk.to']");
      if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);

      delete window.Tawk_API;
    };
  }, [onTawkLoad]);
};

export default useTawkHidden;
