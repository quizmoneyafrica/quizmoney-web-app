'use client'

import { formatNaira, formatRank } from '@/app/utils/utils'
import { Avatar, Flex, Grid, Skeleton, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import QmDrawer from '../drawer/drawer'
import Image from 'next/image'
import { useAllTimeLeaderboard } from '@/lib/queries'

const avatarColors = ['#F2F2F2', '#AFF0FF', '#C4FBD2', '#FFCBD2', '#FFF6C5']

interface GamerDisplay {
  rank: number
  avatarUrl: string
  firstName: string
  prizeWon: number
  gamesPlayed: number
  score: number
}

function TopGamers() {
  const { data, isLoading } = useAllTimeLeaderboard(20)
  const [open, setOpen] = useState(false)
  const [gamerInfo, setGamerInfo] = useState<GamerDisplay | null>(null)

  const topGamers: GamerDisplay[] = (data ?? []).map((entry) => ({
    rank: entry.rank,
    avatarUrl: entry.avatar_url ?? '',
    firstName: entry.username,
    prizeWon: entry.prize ?? 0,
    gamesPlayed: entry.score,
    score: entry.score,
  }))

  const handleViewGamer = (gamer: GamerDisplay) => {
    setGamerInfo(gamer)
    setOpen(true)
  }

  const skeletonList = (
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
  )

  return (
    <div className="bg-white rounded-[20px] w-full py-6 grid grid-cols-1 gap-3">
      <Text className="text-neutral-800 font-bold text-xl px-6">
        Top Gamers of the Week
      </Text>
      <div className="flex scrollbar-hide overflow-x-auto gap-4 scrollbar-hide pl-4">
        {isLoading ? (
          skeletonList
        ) : topGamers.length > 0 ? (
          <QmDrawer
            open={open}
            onOpenChange={setOpen}
            title="Player Stats"
            trigger={
              <div className="flex gap-4">
                {topGamers.map((gamer, index) => (
                  <Gamers
                    key={index}
                    gamer={gamer}
                    onClick={() => handleViewGamer(gamer)}
                  />
                ))}
              </div>
            }
          >
            {gamerInfo && (
              <div className="grid place-items-center gap-3 max-w-lg mx-auto">
                <div className="flex items-center justify-center bg-primary-100 h-[90px] w-[90px] rounded-full overflow-clip">
                  <Image
                    src={gamerInfo.avatarUrl || '/icons/quizmoney-logo-blue.svg'}
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
                  <Grid
                    columns="3"
                    className="bg-primary-50 rounded-xl p-4 w-full"
                  >
                    <Flex direction="column" align="center" justify="center">
                      <p>Rank</p>
                      <div className="flex min-h-10 min-w-10 h-auto w-auto items-center text-sm text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                        {formatRank(gamerInfo.rank)}
                      </div>
                    </Flex>
                    <Flex direction="column" align="center" justify="center">
                      <p>Score</p>
                      <div className="flex min-h-10 min-w-10 h-auto w-auto text-sm items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                        {gamerInfo.gamesPlayed}
                      </div>
                    </Flex>
                    <Flex direction="column" align="center" justify="center">
                      <p>Amount</p>
                      <div className="flex h-auto w-auto items-center justify-center font-semibold text-primary-800 p-2">
                        {formatNaira(gamerInfo.prizeWon)}
                      </div>
                    </Flex>
                  </Grid>
                </div>
              </div>
            )}
          </QmDrawer>
        ) : (
          skeletonList
        )}
      </div>
    </div>
  )
}

export default TopGamers

type Props = {
  gamer: GamerDisplay
  onClick: () => void
}
const Gamers = ({ gamer, onClick }: Props) => {
  const bgColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[90px] text-center space-y-1 cursor-pointer overflow-hidden"
    >
      <Avatar
        radius="full"
        src={gamer.avatarUrl}
        fallback={gamer.firstName[0] ?? '?'}
        style={{ backgroundColor: bgColor }}
        size="4"
      />
      <Flex direction="column" align="center">
        <Text size="2" weight="medium" className="text-neutral-800 capitalize">
          {gamer.firstName}
        </Text>
        <Text size="1" className="text-primary-800">
          {formatNaira(gamer.prizeWon)}
        </Text>
      </Flex>
    </div>
  )
}
