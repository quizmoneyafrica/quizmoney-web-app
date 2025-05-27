import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { Transaction, UserWalletTransaction } from "../store/walletSlice";

// export function isIosPwaInstalled(): boolean {
//   if (typeof window === "undefined") return false;

//   const isIos = /iphone|ipad|ipod/.test(
//     window.navigator.userAgent.toLowerCase()
//   );
//   const isStandalone =
//     ("standalone" in navigator && navigator.standalone === true) ||
//     window.matchMedia("(display-mode: standalone)").matches;

//   return isIos && isStandalone;
// }

export function isIosPwaInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIosDevice =
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("macintosh") && "ontouchend" in document);

  const isStandalone =
    ("standalone" in navigator && navigator.standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches;

  return isIosDevice && isStandalone;
}

// export const isMobileOrTablet = () => {
//   if (typeof window === "undefined") return false;
//   return /iphone|ipad|ipod|android|mobile/i.test(
//     window.navigator.userAgent.toLowerCase()
//   );
// };
export const isMobileOrTablet = () => {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent.toLowerCase();

  const isTouchMac = ua.includes("macintosh") && "ontouchend" in document; // modern iPads

  return /iphone|ipad|ipod|android|mobile/i.test(ua) || isTouchMac;
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const toastPosition = isMobileOrTablet() ? "top-center" : "top-right";
export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const formatCountDown = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};
//For auth verification
export const resendTimer = 300;

export interface FlatTransaction extends Transaction {
  section: string;
}

export function flattenTransactionsByDate(
  transactionsByDate: UserWalletTransaction[]
): FlatTransaction[] {
  return transactionsByDate.flatMap((section) =>
    section.transactions.map((tx) => ({
      ...tx,
      section: section.date,
    }))
  );
}

//Format Amounts
export function formatNaira(
  amount: number | string,
  showDecimals = false
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(value);
}

//Date
export function formatQuizDate(input: string): string {
  const date = parseISO(input);

  const time = format(date, "h:mm a");

  if (isToday(date)) {
    return `Today, ${time}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${time}`;
  } else if (!isPast(date)) {
    return `${format(date, "EEEE")}, ${time}`;
  } else {
    // Past date
    return `${format(date, "MMM do")}, ${time}`;
  }
}

//notification
export function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  const time = format(date, "h:mm a");
  const fullDate = format(date, "MMM dd, yyyy");

  return {
    time,
    fullDate,
  };
}

export function readTotalTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  const parts = [
    hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : "",
    minutes > 0 ? `${minutes} min${minutes !== 1 ? "s" : ""}` : "",
    seconds > 0 ? `${seconds} second${seconds !== 1 ? "s" : ""}` : "",
    milliseconds > 0 ? `${milliseconds} ms` : "",
  ];

  return parts.filter(Boolean).join(", ");
}

export function parseTimeStringToMilliseconds(time: string): number {
  const [mm, ss, ms] = time.split(":").map(Number);

  return (mm || 0) * 60000 + (ss || 0) * 1000 + (ms || 0);
}

export function truncateWords(text: string, limit: number = 5): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + " ...";
}
export function formatRank(n: number): string {
  const suffixes: { [key: number]: string } = { 1: "st", 2: "nd", 3: "rd" };
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? "th"
      : suffixes[lastDigit] || "th";

  return `${n}${suffix}`;
}
export function disableConsoleInProduction() {
  if (process.env.NODE_ENV === "production") {
    for (const method of ["log", "warn", "error", "info", "debug"] as const) {
      console[method] = () => {};
    }
  }
}
