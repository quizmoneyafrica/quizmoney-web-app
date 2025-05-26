import UserAPI from "@/app/api/userApi";
import { formatNaira, formatRank, toastPosition } from "@/app/utils/utils";
import { Avatar, Flex, Grid, Skeleton, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QmDrawer from "../drawer/drawer";
import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, XIcon } from "@/app/icons/icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import {
  initialTopGamers,
  setTopGamers,
  TopGamersState,
} from "@/app/store/gameSlice";

const avatarColors = ["#F2F2F2", "#AFF0FF", "#C4FBD2", "#FFCBD2", "#FFF6C5"];
function TopGamers() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [gamerInfo, setGamerInfo] = useState<TopGamersState>(initialTopGamers);
  const { topGamers } = useAppSelector((state) => state.game);

  useEffect(() => {
    const fetchTopGamers = async () => {
      if (topGamers !== null) return null;
      setLoading(true);
      try {
        const res = await UserAPI.topGamersOfToday();
        console.log(res.data.result.monthlyLeaderboard);
        // setTopGamers(res.data.result.monthlyLeaderboard);
        dispatch(setTopGamers(res.data.result.monthlyLeaderboard));
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.response.data.error, { position: toastPosition });
        setLoading(false);
      }
    };
    fetchTopGamers();
  }, [dispatch, topGamers]);

  const handleViewGamer = (gamer: TopGamersState) => {
    setGamerInfo(gamer);
    setOpen(true);
    console.log(gamer);
  };

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
        ) : topGamers && topGamers?.length > 0 ? (
          <>
            <QmDrawer
              open={open}
              onOpenChange={setOpen}
              title="Player Stats"
              trigger={
                <div className="flex gap-4 ">
                  {topGamers?.map((gamer: TopGamersState, index) => (
                    <Gamers
                      key={index}
                      gamer={gamer}
                      onClick={() => handleViewGamer(gamer)}
                    />
                  ))}
                </div>
              }
            >
              <div className="grid place-items-center gap-3 max-w-lg mx-auto">
                <div className="flex items-center justify-center bg-primary-100 h-[90px] w-[90px] rounded-full overflow-clip">
                  <Image
                    src={gamerInfo.avatar}
                    alt={gamerInfo.firstName}
                    width={70}
                    height={70}
                    className="rounded-full"
                  />
                </div>
                <p className="text-center capitalize text-primary-700 text-xl sm:text-2xl font-semibold">
                  {gamerInfo.firstName}
                </p>

                <div className="flex flex-col gap-2 w-full md:w-[80%]">
                  {/* <p className="text-sm font-semibold">Player Stats</p> */}
                  <Grid
                    columns="3"
                    className="bg-primary-50 rounded-xl p-4 w-full"
                  >
                    <Flex direction="column" align="center" justify="center">
                      <p>Rank</p>
                      <div className="flex min-h-10 min-w-10 h-auto w-auto items-center text-sm text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                        {formatRank(gamerInfo.overallRank)}
                      </div>
                    </Flex>

                    <Flex direction="column" align="center" justify="center">
                      <p>Games</p>
                      <div className="flex min-h-10 min-w-10 h-auto w-auto text-sm items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                        {gamerInfo.noOfGamesPlayed}
                      </div>
                    </Flex>
                    <Flex direction="column" align="center" justify="center">
                      <p>Prize</p>
                      <div className="flex h-auto w-auto items-center justify-center font-semibold text-primary-800  p-2">
                        {formatNaira(Number(gamerInfo.amountWon))}
                      </div>
                    </Flex>
                  </Grid>
                </div>

                <div className="grid place-items-center gap-3 items-center">
                  {(gamerInfo.facebook ||
                    gamerInfo.instagram ||
                    gamerInfo.twitter) && (
                    <p className="text-lg sm:text-xl font-semibold">
                      Social Links
                    </p>
                  )}
                  <div className="flex gap-2 text-primary-900">
                    {gamerInfo.facebook && (
                      <Link
                        href={`https://facebook.com/${gamerInfo.facebook}`}
                        target="_blank"
                      >
                        <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                          {/* <FacebookIcon /> */}
                          {/* <i className="bi bi-facebook text-lg"></i> */}
                          <FacebookIcon />
                        </div>
                      </Link>
                    )}
                    {gamerInfo.instagram && (
                      <Link
                        href={`https://instagram.com/${gamerInfo.instagram}`}
                        target="_blank"
                      >
                        <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                          <InstagramIcon />
                        </div>
                      </Link>
                    )}
                    {gamerInfo.twitter && (
                      <Link
                        href={`https://x.com/${gamerInfo.twitter}`}
                        target="_blank"
                      >
                        {" "}
                        <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                          <XIcon />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </QmDrawer>
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
  onClick: () => void;
};
const Gamers = ({ gamer, onClick }: Props) => {
  const bgColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  return (
    <div
      onClick={onClick}
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
