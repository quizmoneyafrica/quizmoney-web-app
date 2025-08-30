import { PlayIcon, WaveLine, WaveLineLarge, WinX } from "@/app/icons/icons";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import React, { ReactElement } from "react";

export interface GameZoneCardObject {
  title: ReactElement;
  description: string;
  onClick: () => void;
  src: string;
  btnText?: string;
  stakeMultiplier?: number;
  btnDisabled?: boolean;
}

export type gamesObject = {
  data: GameZoneCardObject;
  className?: string;
  variant?: "cyan" | "blue" | "green";
  showBadge?: boolean;
};

function GameZoneCardTemp(props: gamesObject) {
  const { data, className = "", variant = "cyan", showBadge = true } = props;
  const styles = variantStyles[variant] || "";

  return (
    <div
      className={`${data.btnText === "Coming soon" && "opacity-45"} relative grid grid-cols-3 rounded-[20px] px-4 pb-4 pt-6 ${styles.container} ${className} overflow-clip`}
    >
      <div className={`z-[2] ${!showBadge && "hidden"} absolute -top-[2.9px]`}>
        <Bookmark fill="#F8B93C" width={54.5} height={33.75} stroke="#F8B93C" />
        <span className="absolute top-[1.3em] text-medium left-[2.3em] text-[0.5em]">
          New
        </span>
      </div>
      <div className={`z-[2] col-span-2`}>
        <div className="space-y-5">
          <div className="pt-2 space-y-1">
            {data.title}

            <p className={`text-sm game-z-desc`}>{data.description}</p>
          </div>
          <button
            onClick={data.onClick}
            disabled={data.btnDisabled}
            className={`${styles.button} text-sm font-medium flex items-center gap-1 py-[0.4em] px-4 rounded-[24px]`}
            type="button"
          >
            <PlayIcon />
            <span>{data.btnText ? data.btnText : "Play games"}</span>
          </button>
        </div>
      </div>
      <div className="z-[2] grid place-items-center">
        <Image
          src={data.src}
          alt="Quiz Money Game Zone"
          width={125}
          height={117.43}
          quality={100}
          loading="lazy"
          className="object-contain"
        />
        <WinX className="-ml-2" fillColor={variantFillColor[variant]} />
      </div>
      <div className="absolute w-full z[1] left-0 top-[33%] lg:top-[17%] -space-y-2 opacity-70">
        <WaveLine
          strokeColor={variantStrokeColor[variant]}
          className="lg:hidden"
        />
        <WaveLine
          strokeColor={variantStrokeColor[variant]}
          className="lg:hidden"
        />
        <WaveLineLarge
          strokeColor={variantStrokeColor[variant]}
          className="hidden lg:flex"
        />
        <WaveLineLarge
          strokeColor={variantStrokeColor[variant]}
          className="hidden lg:flex"
        />
      </div>
    </div>
  );
}

export default GameZoneCardTemp;

const variantFillColor: Record<string, string> = {
  cyan: "#17478B",
  blue: "#17478B",
  green: "#009028",
};
const variantStrokeColor: Record<string, string> = {
  cyan: "#00D4FC",
  blue: "#6DB2E4",
  green: "#62F694",
};

const variantStyles: Record<
  NonNullable<gamesObject["variant"]>,
  {
    container: string;
    button?: string;
  }
> = {
  cyan: {
    container: "bg-secondary-50",
    button: "bg-primary-900 text-white ",
  },
  blue: {
    container: "bg-[#E4F4FF]",
    button: "bg-primary-900 text-white ",
  },
  green: {
    container: "bg-positive-50",
    button: "bg-positive-900 text-white ",
  },
};
