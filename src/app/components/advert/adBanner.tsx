import Image from "next/image";
import React from "react";

function AdBanner() {
  return (
    <div className="">
      <Image
        src="/assets/images/ad-banner.png"
        alt="Quiz Money Ad Space"
        width={758}
        height={154}
        priority
        className="w-full h-full object-contain rounded-xl"
        quality={100}
      />
    </div>
  );
}

export default AdBanner;
