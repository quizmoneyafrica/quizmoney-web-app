import ProtectedRoute from "@/app/security/protectedRoute";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ProtectedRoute>{children}</ProtectedRoute>;
}
