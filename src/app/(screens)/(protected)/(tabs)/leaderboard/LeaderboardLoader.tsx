import { Skeleton } from "@radix-ui/themes";
import React from "react";

const LeaderboardLoader = () => {
  return (
    <div className="flex justify-between items-center text-sm md:text-base text-black font-semibold px-5 md:px-10 bg-white rounded-4xl p-3 md:p-5">
      <div className="flex-1 flex gap-[10%] items-center">
        <div className="h-[30px] w-[30px] overflow-clip rounded-full">
          <Skeleton height={"100%"} width={"100%"} />
        </div>

        <div className="flex gap-3 items-center">
          <div className="h-[50px] w-[50px] overflow-clip rounded-full">
            <Skeleton height={"100%"} width={"100%"} />
          </div>
          <Skeleton height={"10px"} width={"80px"} />
        </div>
      </div>
      <Skeleton height={"10px"} width={"80px"} />
    </div>
  );
};

export default LeaderboardLoader;
