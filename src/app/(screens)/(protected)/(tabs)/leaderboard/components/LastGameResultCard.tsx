import CustomImage from "@/app/components/wallet/CustomImage";
import { User } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatNaira } from "@/app/utils/utils";
import { UserLastGameStats } from "@/app/store/leaderboardSlice";
import { getAuthUser } from "@/app/api/userApi";

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
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-lg font-medium text-gray-900 mb-6 text-center sm:text-left"
          >
            My Last game Result
          </motion.h2>

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
                        className="w-12 h-12 p-3 bg-[#E4F1FA] rounded-full flex items-center justify-center"
                      >
                        <User />
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="text-lg font-medium text-primary-900 whitespace-nowrap"
                      >
                        {userLastGameStats.user.firstName}{" "}
                        {userLastGameStats.user.lastName}
                      </motion.span>
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
                        className="w-10 h-10 border-2 border-[#2A75BC] rounded-full flex items-center justify-center"
                      >
                        <span className="text-[#2A75BC] font-medium">
                          {userLastGameStats.totalCorrect}
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="flex items-center space-x-2"
                      >
                        <CustomImage
                          className="w-6 h-6"
                          alt="time"
                          src={"/icons/time.svg"}
                        />
                        <span className="text-[#2A75BC] whitespace-nowrap">
                          {userLastGameStats.totalTime}
                        </span>
                      </motion.div>
                    </motion.div>
                  </td>

                  {/* Reward */}
                  <td className="px-2 text-right">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-[#E4F1FA] rounded p-2 text-xl font-bold text-[#2364AA] whitespace-nowrap"
                    >
                      {formatNaira(userLastGameStats.prize)}
                    </motion.span>
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
