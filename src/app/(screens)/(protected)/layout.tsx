import AppHeader from "@/app/layout/appHeader";
import BottomNavigation from "@/app/layout/BottomNavigation";
import SidebarNav from "@/app/layout/SidebarNav";
import ProtectedRoute from "@/app/security/protectedRoute";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	
	return (
		<ProtectedRoute>
			<div
				className="grid h-screen  grid-cols-1 lg:grid-cols-[250px_1fr] 
            grid-rows-[1fr_auto] lg:grid-rows-1 
            grid-areas-mobile lg:grid-areas-desktop">
				<SidebarNav />
				<main className="grid-in-content bg-[#F9F9F9] overflow-y-auto px-6 py-4">
					<AppHeader />
					{children}
				</main>
				<BottomNavigation />
			</div>
		</ProtectedRoute>
	);
}
