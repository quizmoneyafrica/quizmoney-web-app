import { useAppDispatch } from "@/app/hooks/useAuth";
import {
  ClockSvg,
  MoneyWings,
  OneTwoThree,
  StartGameBtn,
} from "@/app/icons/icons";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";
import { Gamepad2, Info } from "lucide-react";
import React from "react";

function StartPage() {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full max-w-lg mx-auto space-y-10">
      <div className="space-y-4">
        <div>
          <div className="text-primary-900 bg-white rounded-full h-14 w-14 border-4 border-primary-800 grid place-items-center mx-auto">
            <Gamepad2 />
          </div>
          <h2 className="text-center text-[2.3em] text-primary-50">
            Number Guessing
          </h2>
        </div>
        <div className="relative pt-8 !space-text ">
          <div className="w-full z-[2] max-w-3xs py-3 text-center left-[25%] text-white text-md font-bold text bg-[#51A2E0] rounded-full absolute top-0 ">
            <p>How To Play</p>
          </div>
          <div className="bg-white rounded-[20px] space-y-6 p-6 shadow-md shadow-[#D1D8FF] drop-shadow-lg drop-shadow-black/40">
            <div className="space-y-5 mt-4">
              {howToPlay.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-3 rounded-full py-2 px-4 border ${
                      item.variant === "blue"
                        ? "border-[#2364aa78] bg-[#E1F3FF]"
                        : item.variant === "green"
                        ? "border-[#23AA3178] bg-[#D5FFE2]"
                        : "border-[#FFE577] bg-[#FFF7D5]"
                    }`}
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div
                        className={`${
                          item.variant === "blue"
                            ? "bg-[#2364AA] shadow-[0px_3px_0px_0px_rgba(81,162,224,1.00)]"
                            : item.variant === "green"
                            ? "bg-[#23aa3181] shadow-[0px_3px_0px_0px_rgba(35,170,49,0.50)]"
                            : "bg-[#FFDA43] shadow-[0px_3px_0px_0px_rgba(206,166,0,1.00)]"
                        } grid place-items-center text-white font-bold text-sm w-8 h-8  rounded-full  border-[3px] border-white`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.topic}</p>
                        <p className="text-xs">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      {item.svg}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs flex items-center justify-center">
              <Info
                width={20}
                height={20}
                fill="#ee0000"
                className="text-white"
              />
              Note: Minimum stake of &nbsp;
              <span className="font-bold">₦1000</span>&nbsp; is Required
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button onClick={() => dispatch(setGameStatus("STAKE"))} className="">
          <StartGameBtn className="justify-center" />
        </button>
      </div>
    </div>
  );
}

export default StartPage;

const howToPlay = [
  {
    topic: "Guess a number",
    desc: "Pick a number between 1-100",
    svg: <OneTwoThree />,
    variant: "blue",
  },
  {
    topic: "Limited Tries",
    desc: "3 attempts to guess correctly ",
    svg: <ClockSvg />,
    variant: "green",
  },
  {
    topic: "Win up to 3× your stake",
    desc: "Higher rewards for correct guesses",
    svg: <MoneyWings />,
    variant: "yellow",
  },
];
