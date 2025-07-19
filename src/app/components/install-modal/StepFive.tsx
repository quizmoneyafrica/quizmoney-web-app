import Image from "next/image";
import React from "react";

function StepFive() {
  return (
    <div className="rounded-[10px] border border-neutral-300 px-2 py-4 space-y-4">
      <p>
        Step{" "}
        <span className="px-2.5 py-1 text-white rounded-full bg-primary-900">
          5
        </span>
      </p>
      <p>The app will now appear on your home screen like a regular app! ✅</p>
      <Image
        src="/assets/images/qm-added.png"
        alt=""
        width={604}
        height={184}
      />
    </div>
  );
}

export default StepFive;
