import Image from "next/image";
import React from "react";

function StepOne() {
  return (
    <div className="rounded-[10px] border border-neutral-300 px-2 py-4 space-y-4">
      <p>
        Step{" "}
        <span className="px-2.5 py-1 text-white rounded-full bg-primary-900">
          1
        </span>
      </p>
      <p>
        <b>Open the app in Safari browser</b>
      </p>
      <Image src="/assets/images/safari.png" alt="" width={650} height={206} />
      <p>
        Then proceed to{" "}
        <a
          href="https://app.quizmoney.ng"
          className="font-bold text-primary-800 underline underline-offset-4"
        >
          https://app.quizmoney.ng
        </a>
      </p>
    </div>
  );
}

export default StepOne;
