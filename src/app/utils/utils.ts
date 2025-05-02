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
