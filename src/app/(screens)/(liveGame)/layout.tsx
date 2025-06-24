// "use client";
import ProtectedRoute from "@/app/security/protectedRoute";
import React from "react";
// import { useEffect } from "react";

// const useDisableTextSelection = () => {
//   useEffect(() => {
//     const handleMouseDown = (e) => {
//       e.preventDefault();
//     };

//     const handleTouchStart = (e) => {
//       e.preventDefault();
//     };

//     document.addEventListener("mousedown", handleMouseDown);
//     document.addEventListener("touchstart", handleTouchStart);

//     return () => {
//       document.removeEventListener("mousedown", handleMouseDown);
//       document.removeEventListener("touchstart", handleTouchStart);
//     };
//   }, []);
// };

function Layout({ children }: { children: React.ReactNode }) {
  // useDisableTextSelection();
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default Layout;
