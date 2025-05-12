export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24">
		<path
			fill="#4285F4"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.255h5.92a5.06 5.06 0 0 1-2.195 3.32v2.76h3.555c2.08-1.915 3.28-4.735 3.28-8.085"></path>
		<path
			fill="#34A853"
			d="M12 23c2.97 0 5.46-.985 7.28-2.665l-3.555-2.76c-.985.66-2.245 1.05-3.725 1.05-2.865 0-5.29-1.935-6.155-4.535H2.17v2.85A11 11 0 0 0 12 23"></path>
		<path
			fill="#FBBC05"
			d="M5.845 14.09A6.6 6.6 0 0 1 5.5 12c0-.725.125-1.43.345-2.09V7.06H2.17A11 11 0 0 0 1 12c0 1.775.425 3.455 1.17 4.94z"></path>
		<path
			fill="#EA4335"
			d="M12 5.375c1.615 0 3.065.555 4.205 1.645l3.155-3.155C17.455 2.09 14.965 1 12 1 7.7 1 3.98 3.465 2.17 7.06l3.675 2.85C6.71 7.31 9.135 5.375 12 5.375"></path>
	</svg>
);

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="25"
		height="24"
		fill="none"
		viewBox="0 0 25 24">
		<path
			fill="#1977F3"
			d="M24.167 12C24.167 5.56 18.94.333 12.5.333S.833 5.56.833 12c0 5.646 4.014 10.348 9.334 11.433V15.5H7.834V12h2.333V9.083A4.09 4.09 0 0 1 14.25 5h2.917v3.5h-2.334a1.17 1.17 0 0 0-1.166 1.166V12h3.5v3.5h-3.5v8.108c5.891-.583 10.5-5.553 10.5-11.608"></path>
	</svg>
);
export const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="18"
		fill="none"
		viewBox="0 0 16 18">
		<path
			fill="#12121D"
			d="M13.05 17.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C-1.21 12.25-.49 4.59 5.05 4.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM8.03 4.25C7.88 2.02 9.69.18 11.77 0c.29 2.58-2.34 4.5-3.74 4.25"></path>
	</svg>
);

export const CircleArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (
	props
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 24 24"
		{...props}>
		<path
			fillRule="evenodd"
			d="M1.5 12a10.5 10.5 0 1 0 21 0 10.5 10.5 0 0 0-21 0M24 12a12 12 0 1 1-24 0 12 12 0 0 1 24 0m-6.75-.75a.75.75 0 1 1 0 1.5H8.56l3.221 3.219a.752.752 0 0 1-1.062 1.062l-4.5-4.5a.75.75 0 0 1 0-1.062l4.5-4.5a.75.75 0 1 1 1.062 1.062l-3.22 3.219z"
			clipRule="evenodd"></path>
	</svg>
);

export const PersonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 0 1 .16 8.87M7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0"></path>
	</svg>
);

export const EyeSlash: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 24 24"
		{...props}>
		<path d="M12.001 3.998c-2.959 0-5.452 1.454-7.5 3.844-.7.817-1.314 1.69-1.812 2.562-.302.527-.486.936-.594 1.188s-.108.561 0 .812c.108.252.292.66.594 1.188a16.7 16.7 0 0 0 1.812 2.562c.301.351.628.7.951 1.008l-1.12 1.112c-.39.39-.412 1.033-.022 1.423.391.391 1.02.41 1.41.02l4.875-4.907 4.25-4.218 4.875-4.875a1.03 1.03 0 0 0 0-1.438 1.01 1.01 0 0 0-.719-.28c-.256-.001-.522.122-.718.317l-1.253 1.27c-1.493-.994-3.23-1.588-5.029-1.588m0 2c1.25 0 2.483.378 3.568 1.028l-1.513 1.535a4.24 4.24 0 0 0-2.055-.563 4 4 0 0 0-4 4c0 .717.235 1.444.581 2.041l-1.729 1.695a12 12 0 0 1-.852-.892 14.5 14.5 0 0 1-1.562-2.25c-.155-.27-.222-.411-.313-.594.091-.184.158-.323.313-.594.44-.768.95-1.536 1.562-2.25 1.702-1.985 3.71-3.156 6-3.156m7.938 2.844a1 1 0 0 0-.75.156.98.98 0 0 0-.25 1.375c.34.498.633 1.01.875 1.47.038.071.031.094.062.155-.09.183-.158.323-.312.594-.44.768-.95 1.536-1.563 2.25-1.702 1.985-3.709 3.156-6 3.156-.248 0-.774-.049-1.28-.125a.99.99 0 0 0-1.126.844.99.99 0 0 0 .844 1.125c.606.091 1.181.156 1.562.156 2.96 0 5.452-1.454 7.5-3.844a16.7 16.7 0 0 0 1.813-2.562c.301-.528.485-.936.593-1.188s.108-.56 0-.812a14.2 14.2 0 0 0-1.312-2.344 1 1 0 0 0-.656-.406m-7.938 1.156c.154 0 .401.033.546.067l-2.464 2.451a1.3 1.3 0 0 1-.082-.518 2 2 0 0 1 2-2"></path>
	</svg>
);
export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 24 24"
		{...props}>
		<path d="M12.001 3.998c-2.959 0-5.452 1.454-7.5 3.844a16.7 16.7 0 0 0-1.813 2.562 12 12 0 0 0-.593 1.188 1.06 1.06 0 0 0 0 .812c.108.252.292.66.593 1.188a16.7 16.7 0 0 0 1.813 2.562c2.048 2.39 4.541 3.844 7.5 3.844 2.96 0 5.452-1.454 7.5-3.844.7-.817 1.314-1.69 1.812-2.562.302-.528.486-.936.594-1.188a1.06 1.06 0 0 0 0-.812c-.108-.252-.292-.66-.594-1.188a16.7 16.7 0 0 0-1.812-2.562c-2.048-2.39-4.54-3.844-7.5-3.844m0 2c2.291 0 4.298 1.171 6 3.156a14.5 14.5 0 0 1 1.562 2.25c.155.271.222.411.313.594-.09.183-.158.323-.313.594-.439.768-.95 1.536-1.562 2.25-1.702 1.985-3.709 3.156-6 3.156s-4.298-1.171-6-3.156a14.6 14.6 0 0 1-1.563-2.25c-.154-.271-.22-.411-.312-.594.091-.183.158-.323.312-.594.44-.768.951-1.536 1.563-2.25 1.702-1.985 3.71-3.156 6-3.156m0 2a4 4 0 1 0 4 4 1 1 0 0 0-2 0 2 2 0 1 1-2-2c.245 0 .496.041.72.125A.997.997 0 0 0 14 9.529a.997.997 0 0 0-.594-1.281 4 4 0 0 0-1.406-.25"></path>
	</svg>
);
export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M2 8.5c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5H7"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9M2 16.5h6M2 12.5h3"></path>
	</svg>
);
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M12 18v-3M10.07 2.82 3.14 8.37c-.78.62-1.28 1.93-1.11 2.91l1.33 7.96c.24 1.42 1.6 2.57 3.04 2.57h11.2c1.43 0 2.8-1.16 3.04-2.57l1.33-7.96c.16-.98-.34-2.29-1.11-2.91l-6.93-5.54c-1.07-.86-2.8-.86-3.86-.01"></path>
	</svg>
);
export const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M13 9H7M22 10.97v2.06c0 .55-.44 1-1 1.02h-1.96c-1.08 0-2.07-.79-2.16-1.87-.06-.63.18-1.22.6-1.63.37-.38.88-.6 1.44-.6H21c.56.02 1 .47 1 1.02"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M17.48 10.55c-.42.41-.66 1-.6 1.63.09 1.08 1.08 1.87 2.16 1.87H21v1.45c0 3-2 5-5 5H7c-3 0-5-2-5-5v-7c0-2.72 1.64-4.62 4.19-4.94q.39-.06.81-.06h9c.26 0 .51.01.75.05C19.33 3.85 21 5.76 21 8.5v1.45h-2.08c-.56 0-1.07.22-1.44.6"></path>
	</svg>
);
export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="22"
		height="20"
		fill="none"
		viewBox="0 0 22 20"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.714"
			d="M2.357 12.143v6.429c0 .189.083.37.23.505.148.133.348.209.556.209h15.714a.83.83 0 0 0 .556-.21.68.68 0 0 0 .23-.505v-6.428m-7.071 0v7.143m-10.215-5h10.215M.786 5.714l2.357-5h15.714l2.357 5zm0 0v1.429c0 .758.33 1.484.92 2.02A3.3 3.3 0 0 0 3.93 10h.44a3.3 3.3 0 0 0 2.222-.837c.59-.536.92-1.262.92-2.02V5.714"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.714"
			d="M14.536 5.714v1.429m0 0c0 .758-.331 1.484-.92 2.02a3.3 3.3 0 0 1-2.223.837h-.786a3.3 3.3 0 0 1-2.222-.837c-.59-.536-.92-1.262-.92-2.02V5.714m7.07 1.429c0 .758.332 1.484.921 2.02A3.3 3.3 0 0 0 17.68 10h.393a3.3 3.3 0 0 0 2.222-.837c.59-.536.92-1.262.92-2.02V5.714"></path>
	</svg>
);
export const CupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M12.15 16.5v2.1"></path>
		<path
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M7.15 22h10v-1c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v1Z"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M6.15 22h12M12 16c-3.87 0-7-3.13-7-7V6c0-2.21 1.79-4 4-4h6c2.21 0 4 1.79 4 4v3c0 3.87-3.13 7-7 7"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M5.47 11.65c-.75-.24-1.41-.68-1.93-1.2-.9-1-1.5-2.2-1.5-3.6s1.1-2.5 2.5-2.5h.65c-.2.46-.3.97-.3 1.5v3c0 1 .21 1.94.58 2.8M18.53 11.65c.75-.24 1.41-.68 1.93-1.2.9-1 1.5-2.2 1.5-3.6s-1.1-2.5-2.5-2.5h-.65c.2.46.3.97.3 1.5v3c0 1-.21 1.94-.58 2.8"></path>
	</svg>
);
export const SettingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9"></path>
	</svg>
);
export const SupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M17 18.43h-4l-4.45 2.96A.997.997 0 0 1 7 20.56v-2.13c-3 0-5-2-5-5v-6c0-3 2-5 5-5h10c3 0 5 2 5 5v6c0 3-2 5-5 5"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M12 11.36v-.21c0-.68.42-1.04.84-1.33.41-.28.82-.64.82-1.3 0-.92-.74-1.66-1.66-1.66s-1.66.74-1.66 1.66M11.996 13.75h.008"></path>
	</svg>
);
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M2 12h12.88"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M12.65 8.65 16 12l-3.35 3.35"></path>
	</svg>
);
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		fill="currentColor"
		viewBox="0 0 18 18"
		{...props}>
		<path d="M2.637 15.363A9 9 0 1 1 15.142 2.416 9 9 0 0 1 2.637 15.363m11.457-1.269A7.204 7.204 0 1 0 3.906 3.906a7.204 7.204 0 0 0 10.188 10.188M6.3 5.4 13.5 9l-7.2 3.6z"></path>
	</svg>
);
export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M12 6.44v3.33M12.02 2C8.34 2 5.36 4.98 5.36 8.66v2.1c0 .68-.28 1.7-.63 2.28l-1.27 2.12c-.78 1.31-.24 2.77 1.2 3.25a23.34 23.34 0 0 0 14.73 0 2.22 2.22 0 0 0 1.2-3.25l-1.27-2.12c-.35-.58-.63-1.61-.63-2.28v-2.1C18.68 5 15.68 2 12.02 2Z"></path>
		<path
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M15.33 18.82c0 1.83-1.5 3.33-3.33 3.33-.91 0-1.75-.38-2.35-.98s-.98-1.44-.98-2.35"></path>
	</svg>
);
export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
	props
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5"></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M15.695 13.7h.009M15.695 16.7h.009M11.996 13.7h.008M11.996 16.7h.008M8.294 13.7h.01M8.294 16.7h.01"></path>
	</svg>
);
export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
	props
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="9"
		fill="none"
		viewBox="0 0 18 9"
		stroke="currentColor"
		{...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeMiterlimit="10"
			strokeWidth="1.5"
			d="M16.92.95 10.4 7.47c-.77.77-2.03.77-2.8 0L1.08.95"></path>
	</svg>
);
export const EraserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		fill="currentColor"
		viewBox="0 0 14 14"
		{...props}>
		<path d="M.952 7.96a1.2 1.2 0 0 0 0 1.698l3.394 3.393a1.2 1.2 0 0 0 1.696 0l1.77-1.77a3.3 3.3 0 0 1 .146-1.276l-.563.563-3.96-3.96 5.091-5.091a.4.4 0 0 1 .566 0l3.394 3.394a.4.4 0 0 1 0 .566l-2.48 2.48a3.2 3.2 0 0 1 1.276-.145l1.77-1.77a1.2 1.2 0 0 0 0-1.696L9.657.95a1.2 1.2 0 0 0-1.698 0zm.565 1.132a.4.4 0 0 1 0-.565l1.352-1.352 3.96 3.96-1.352 1.352a.4.4 0 0 1-.566 0zM11 13.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8"></path>
	</svg>
);
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		viewBox="0 0 16 16"
		{...props}>
		<path d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8m0 1.23A6.76 6.76 0 0 1 14.77 8 6.76 6.76 0 0 1 8 14.77 6.76 6.76 0 0 1 1.23 8 6.76 6.76 0 0 1 8 1.23m-.615 3.078v3.077H4.308v1.23h3.077v3.077h1.23V8.615h3.077v-1.23H8.615V4.308z"></path>
	</svg>
);
export const ArrowDownFillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="11"
		height="6"
		fill="currentColor"
		viewBox="0 0 11 6"
		{...props}>
		<path d="M9.693.295H1.306a.763.763 0 0 0-.538 1.303l3.669 3.67a1.51 1.51 0 0 0 2.132 0l1.395-1.396 2.274-2.274c.475-.481.135-1.303-.545-1.303"></path>
	</svg>
);
