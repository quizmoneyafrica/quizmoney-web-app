export function isIosPwaInstalled(): boolean {
    if (typeof window === "undefined") return false;
  
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = window.navigator.standalone === true;
  
    return isIos && isStandalone;
  }