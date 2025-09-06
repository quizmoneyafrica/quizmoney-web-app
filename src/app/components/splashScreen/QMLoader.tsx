import Image from "next/image";
import React from "react";

function QMLoader() {
  return (
    <div className="flex-col gap-4 flex items-center justify-center relative w-28 h-28">
      <div className="w-28 h-28 border-8 text-primary-900 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-primary-900 rounded-full"></div>
      <Image
        src="/icons/quizmoney-logo-blue.svg"
        alt="Quiz Money"
        width={180}
        height={38}
        priority
        className="w-[60%] absolute animate-pulse"
      />
    </div>
  );
}

export default QMLoader;
