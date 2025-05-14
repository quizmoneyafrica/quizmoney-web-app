import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { Transaction, UserWalletTransaction } from "../store/walletSlice";

export function isIosPwaInstalled(): boolean {
	if (typeof window === "undefined") return false;

	const isIos = /iphone|ipad|ipod/.test(
		window.navigator.userAgent.toLowerCase()
	);
	const isStandalone =
		("standalone" in navigator && navigator.standalone === true) ||
		window.matchMedia("(display-mode: standalone)").matches;

	return isIos && isStandalone;
}

export const isMobileOrTablet = () => {
	if (typeof window === "undefined") return false;
	return /iphone|ipad|ipod|android|mobile/i.test(
		window.navigator.userAgent.toLowerCase()
	);
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
export function formatNaira(amount: number | string, showDecimals = false): string {
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