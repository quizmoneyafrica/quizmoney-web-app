import { TimerIcon } from "@/app/icons/icons";
import { Flex, Skeleton } from "@radix-ui/themes";
import React from "react";

function LoadingState() {
  return (
    <>
      <div className="min-h-screen bg-primary-900 hero flex flex-col items-center  px-4">
        <div className="w-full mx-auto max-w-xl space-y-6">
          {/* Timer, countdown, Avatar  */}
          <div className="grid grid-cols-3 w-full">
            <div className="mt-6 text-white text-sm flex items-center justify-start gap-1">
              <TimerIcon width={23} />{" "}
              <span>
                <Skeleton>00.00.00</Skeleton>
              </span>
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
              <Skeleton width="65px" height="65px" className="!rounded-full" />
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-end">
              <Skeleton width="45px" height="45px" className="!rounded-full" />
            </div>
          </div>
          <div className="space-y-6">
            {/* Question  */}
            <div className="bg-white border-6 border-secondary-500 rounded-[10px] w-full p-4 min-h-[180px] flex items-center justify-center">
              <Flex
                align="center"
                justify="center"
                direction="column"
                className="text-center"
                gap="2"
              >
                <h3 className="font-bold text-xl">
                  <Skeleton>Question 6</Skeleton>
                </h3>
                <p className="font-medium">
                  <Skeleton>
                    When using Skeleton with text, you&apos;d usually wrap the
                    text node itself rather than the parent element.
                  </Skeleton>
                </p>
              </Flex>
            </div>
            {/* Options  */}
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                disabled
                className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition bg-neutral-50 border-neutral-50 text-neutral-900 cursor-not-allowed`}
              >
                <Flex gap="4" align="center" justify="between">
                  <Flex gap="4" align="center">
                    <span className="col-span-1">
                      <Skeleton>A.</Skeleton>
                    </span>
                    <span className="col-span-3">
                      <Skeleton>Lorem ipsum dolor wryw er</Skeleton>
                    </span>
                  </Flex>
                </Flex>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadingState;
