import AppLiveQueries from "@/app/api/queries/AppLiveQueries";
import InstallModal from "@/app/components/install-modal/installModal";
import SocialLinksDrawer from "@/app/components/updateAccount/socialLinksDrawer";
import AppHeader from "@/app/layout/appHeader";
import SidebarNav from "@/app/layout/SidebarNav";
import ProtectedRoute from "@/app/security/protectedRoute";
import { isIosPwaInstalled } from "@/app/utils/utils";
import "react-circular-progressbar/dist/styles.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AppLiveQueries />
      <SocialLinksDrawer />
      {!isIosPwaInstalled() && <InstallModal />}
      <ProtectedRoute>
        <div
          className="h-full overflow-hidden lg:h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] 
         lg:grid-rows-1 grid-areas-mobile lg:grid-areas-desktop"
        >
          <SidebarNav />
          <main className="grid-in-content bg-[#F7F7F7] overflow-y-auto min-h-[100dvh] lg:h-screen w-full max-w-screen lg:max-w-[calc(100vw-250px)]">
            <div className=" px-6 py-4 ">
              <AppHeader />
              {children}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </main>
  );
}
