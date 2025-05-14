import { formatNaira } from "@/app/utils/utils";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import React from "react";

const avatarColors = ["#F2F2F2", "#AFF0FF", "#C4FBD2", "#FFCBD2", "#FFF6C5"];
function TopGamers() {
  const gamersData = [
    { avatar: "", firstName: "Joe", amount: 5000 },
    { avatar: "", firstName: "Sarah", amount: 5000 },
    { avatar: "", firstName: "Hanax", amount: 5000 },
    { avatar: "", firstName: "Inioluwa", amount: 5000 },
    { avatar: "", firstName: "Liz", amount: 5000 },
    { avatar: "", firstName: "Tosin", amount: 5000 },
  ];
  return (
    <div className="bg-white rounded-[20px] w-full px-6 py-6 grid grid-cols-1 gap-2">
      <Text className="text-neutral-800 font-bold text-xl">
        Top Gamers of the Day
      </Text>
      <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
        {gamersData.map((gamer, index) => (
          <Gamers key={index} gamer={gamer} />
        ))}
      </div>
    </div>
  );
}

export default TopGamers;

interface GamerProps {
  avatar: string;
  firstName: string;
  amount: number;
}
type Props = {
  gamer: GamerProps;
};
const Gamers = ({ gamer }: Props) => {
  const bgColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  return (
    <div
      onClick={() => {}}
      className="flex-shrink-0 w-[90px] text-center space-y-1 cursor-pointer overflow-hidden"
    >
      <Avatar
        radius="full"
        src={gamer.avatar}
        fallback={gamer.firstName[0]}
        style={{ backgroundColor: bgColor }}
        size="4"
      />
      <Flex direction="column" align="center">
        <Text size="2" weight="medium" className="text-neutral-800">
          {gamer.firstName}
        </Text>
        <Text size="1" className="text-primary-800">
          {formatNaira(gamer.amount)}
        </Text>
      </Flex>
    </div>
  );
};
