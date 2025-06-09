import { NlrcIcon } from "@/app/icons/icons";
import { Text } from "@radix-ui/themes";
import React from "react";

function NLRC() {
  return (
    <div className="flex items-center justify-center !font-text gap-3">
      <NlrcIcon />
      <div className="grid">
        <Text className="text-black font-bold">Licensed by</Text>
        <Text className="text-black/50 font-medium">
          National Lottery <br /> Regulatory Commission
        </Text>
      </div>
    </div>
  );
}

export default NLRC;
