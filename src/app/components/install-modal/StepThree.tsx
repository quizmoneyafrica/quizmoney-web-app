import Image from "next/image";
import React from "react";

function StepThree() {
  return (
    <div className="rounded-[10px] border border-neutral-300 px-2 py-4 space-y-4">
      <p>
        Step{" "}
        <span className="px-2.5 py-1 text-white rounded-full bg-primary-900">
          3
        </span>
      </p>
      <p>
        Scroll and tap <b>&apos;Add to Home Screen&apos;</b>.
      </p>
      <Image
        src="/assets/images/homescreen.png"
        alt=""
        width={600}
        height={344}
      />
    </div>
  );
}

export default StepThree;
