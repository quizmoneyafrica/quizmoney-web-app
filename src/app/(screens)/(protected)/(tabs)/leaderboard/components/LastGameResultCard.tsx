import { AlarmClockIcon, ArrowRightCircle } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  formatNaira,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { UserLastGameStats } from "@/app/store/leaderboardSlice";
import { getAuthUser } from "@/app/api/userApi";
import { Avatar } from "@radix-ui/themes";
import { QMCoin, VerifiedBadge } from "@/app/icons/icons";

interface LastGameResultCardProps {
  userLastGameStats?: UserLastGameStats;
}

const LastGameResultCard = ({ userLastGameStats }: LastGameResultCardProps) => {
  const user = getAuthUser();

  console.log(JSON.stringify(user, null, 2));

  if (!userLastGameStats) return null;

  return (
    <Link href={"/leaderboard/my-last-game-result"} className="w-full ">
      <motion.div
        // whileHover={{ scale: 1.02 }}
        // transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border-2 border-[#51A2E0]"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-lg font-medium text-gray-900 mb-6 text-center sm:text-left"
            >
              My Last game Result
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm flex items-center gap-1 cursor-pointer font-medium bg-primary-50 px-2 py-1 rounded-lg text-primary-900 mb-6 text-center sm:text-left"
            >
              See more..{" "}
              <ArrowRightCircle className="text-primary-700" size={14} />
            </motion.span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <tbody>
                <tr>
                  {/* Player Info */}
                  <td className="px-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex items-center space-x-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 p-1 bg-[#E4F1FA] rounded-full flex items-center justify-center"
                      >
                        {/* <User /> */}
                        <Avatar
                          src={userLastGameStats.user.avatar}
                          fallback={userLastGameStats.user.firstName
                            .charAt(0)
                            .toUpperCase()}
                          radius="full"
                        />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="capitalize font-medium whitespace-nowrap flex items-center gap-1"
                      >
                        <span>
                          {userLastGameStats.user.firstName}{" "}
                          {userLastGameStats.user.lastName}
                        </span>
                        <span>{user.kycVerified && <VerifiedBadge />}</span>
                      </motion.p>
                    </motion.div>
                  </td>

                  {/* Time */}
                  <td className="px-2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="flex-row flex items-center gap-2"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center h-full justify-start "
                      >
                        <span className="flex items-center  justify-center md:h-10 md:w-10 w-6 h-6 text-primary-800 border-2 border-primary-800 rounded-full p-2 font-medium">
                          {userLastGameStats.totalCorrect}
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="flex items-center space-x-2"
                      >
                        <AlarmClockIcon
                          className="text-primary-800"
                          size={14}
                        />
                        <span className="text-sm text-primary-800 font-semibold whitespace-nowrap">
                          {readLeaderboardTotalTime(
                            parseTimeStringToMilliseconds(
                              userLastGameStats.totalTime
                            )
                          )}
                        </span>
                      </motion.div>
                    </motion.div>
                  </td>

                  {/* Reward */}
                  <td className="px-2 text-right">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                      className={`${
                        userLastGameStats && userLastGameStats?.coins > 0
                          ? "bg-primary-50"
                          : "bg-primary-100"
                      } rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base text-primary-800 font-bold`}
                    >
                      {userLastGameStats.coins > 0 ? (
                        <span className="flex items-center gap-2 text-positive-900 justify-center">
                          <QMCoin width={20} height={20} />+
                          {userLastGameStats.coins}
                        </span>
                      ) : (
                        formatNaira(Number(userLastGameStats.prize), true)
                      )}
                    </motion.div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default LastGameResultCard;
