import UserAPI from "@/app/api/userApi";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import { Avatar, Flex, Skeleton, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const avatarColors = ["#F2F2F2", "#AFF0FF", "#C4FBD2", "#FFCBD2", "#FFF6C5"];
function TopGamers() {
  // const gamersData = [
  //   { avatar: "", firstName: "Joe", amount: 5000 },
  //   { avatar: "", firstName: "Sarah", amount: 5000 },
  //   { avatar: "", firstName: "Hanax", amount: 5000 },
  //   { avatar: "", firstName: "Inioluwa", amount: 5000 },
  //   { avatar: "", firstName: "Liz", amount: 5000 },
  //   { avatar: "", firstName: "Tosin", amount: 5000 },
  // ];
  const [loading, setLoading] = useState(true);
  const [topGamers, setTopGamers] = useState([]);
  useEffect(() => {
    const fetchTopGamers = async () => {
      try {
        const res = await UserAPI.topGamersOfToday();
        console.log(res.data.result.monthlyLeaderboard);
        setTopGamers(res.data.result.monthlyLeaderboard);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.response.data.error, { position: toastPosition });
        setLoading(false);
      }
    };
    fetchTopGamers();
  }, []);
  return (
    <div className="bg-white rounded-[20px] w-full  py-6 grid grid-cols-1 gap-3">
      <Text className="text-neutral-800 font-bold text-xl px-6">
        Top Gamers of the Month
      </Text>
      <div className="flex scrollbar-hide overflow-x-auto gap-4 scrollbar-hide pl-4">
        {loading ? (
          <>
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 mr-3 text-center space-y-1 cursor-pointer overflow-hidden"
              >
                <div className="rounded-full overflow-clip">
                  <Skeleton width="48px" height="48px" />
                </div>
                <Flex direction="column" align="center">
                  <Text size="2" weight="medium" className="text-neutral-800">
                    <Skeleton>Tosin</Skeleton>
                  </Text>
                  <Text size="1" className="text-primary-800">
                    <Skeleton>₦5,000</Skeleton>
                  </Text>
                </Flex>
              </div>
            ))}
          </>
        ) : topGamers.length > 0 ? (
          <>
            {topGamers.map((gamer, index) => (
              <Gamers key={index} gamer={gamer} />
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 mr-3 text-center space-y-1 cursor-pointer overflow-hidden"
              >
                <div className="rounded-full overflow-clip">
                  <Skeleton width="48px" height="48px" />
                </div>
                <Flex direction="column" align="center">
                  <Text size="2" weight="medium" className="text-neutral-800">
                    <Skeleton>Tosin</Skeleton>
                  </Text>
                  <Text size="1" className="text-primary-800">
                    <Skeleton>₦5,000</Skeleton>
                  </Text>
                </Flex>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default TopGamers;

interface GamerProps {
  amountWon: number;
  avatar: string;
  facebook: string;
  firstName: string;
  instagram: string;
  noOfGamesPlayed: number;
  overallRank: number;
  twitter: string;
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
        <Text size="2" weight="medium" className="text-neutral-800 capitalize">
          {gamer.firstName}
        </Text>
        <Text size="1" className="text-primary-800">
          {formatNaira(gamer.amountWon)}
        </Text>
      </Flex>
    </div>
  );
};
