import Image from "next/image";
import React from "react";

function StepFour() {
  return (
    <div className="rounded-[10px] border border-neutral-300 px-2 py-4 space-y-4">
      <p>
        Step{" "}
        <span className="px-2.5 py-1 text-white rounded-full bg-primary-900">
          4
        </span>
      </p>
      <p>
        Tap <b>&apos;Add &apos;</b> at the top-right corner.
      </p>
      <Image
        src="/assets/images/add-to-home.png"
        alt=""
        width={600}
        height={344}
      />
    </div>
  );
}

export default StepFour;
