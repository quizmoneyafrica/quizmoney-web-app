import CustomButton from "@/app/utils/CustomBtn";
import { useRouter } from "next/navigation";
import React from "react";

function NotStarted() {
  const router = useRouter();
  return (
    <>
      <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
          <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
            <span className="text-5xl">🎮 </span>
            <p className="font-medium text-base">
              You probably refreshed this page
            </p>
            <p>
              Go back home to see game details
              <br /> Tap the button 👇
            </p>

            <CustomButton
              width="medium"
              onClick={() => router.replace("/home")}
            >
              Go Home
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotStarted;
