export function isIosPwaInstalled(): boolean {
    if (typeof window === "undefined") return false;
  
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = ("standalone" in navigator && navigator.standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches;;
  
    return isIos && isStandalone;
  }