import Image from "next/image";
import React from "react";

function StepTwo() {
  return (
    <div className="rounded-[10px] border border-neutral-300 px-2 py-4 space-y-4">
      <p>
        Step{" "}
        <span className="px-2.5 py-1 text-white rounded-full bg-primary-900">
          2
        </span>
      </p>
      <p>
        Tap the Share icon <b>(bottom center – a square with an arrow)</b>.
      </p>
      <Image
        src="/assets/images/share-image.png"
        alt=""
        width={666}
        height={278}
      />
    </div>
  );
}

export default StepTwo;
