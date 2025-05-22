import { ApiResponse } from "@/app/api/interface";
import NotificationApi from "@/app/api/notification";
import { formatDateTime, truncateWords } from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
import React from "react";

type Props = {
  notification: ApiResponse;
  setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>;
  setPassedNotification: React.Dispatch<React.SetStateAction<ApiResponse>>;
};

export const NotificationBox = ({
  notification,
  setPassedNotification,
  setOpenNotification,
}: Props) => {
  const { time, fullDate } = formatDateTime(notification.createdAt);

  const handleViewNotification = async () => {
    setOpenNotification(true);
    setPassedNotification(notification);
    try {
      await NotificationApi.readNotification(notification.objectId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message);
    }
  };
  return (
    <>
      <button
        onClick={handleViewNotification}
        className="border border-neutral-200 w-full bg-white p-4 rounded-[10px] hover:bg-primary-50 focus:bg-primary-50 cursor-pointer"
      >
        <Grid columns="3" align="center" justify="between">
          <div className="grid grid-cols-[56px_1fr] col-span-2 gap-2 items-center">
            <div className={`h-14 w-14 rounded-full bg-positive-50`}></div>
            <Grid className="text-left">
              <p className="font-bold">{notification.message}</p>
              <span className="text-xs text-neutral-600">
                {truncateWords(notification.mainText)}
              </span>
            </Grid>
          </div>
          {/* Right  */}
          <Grid gap="2">
            <Flex
              direction="column"
              align="end"
              justify="end"
              className="text-neutral-600 text-sm"
            >
              <span>{time}</span>
              <Flex align="center" gap="1">
                <span>{fullDate}</span>
                {!notification.read && (
                  <div className="h-[8px] w-[8px] bg-positive-900 rounded-full " />
                )}
              </Flex>
            </Flex>
            {!notification.read && (
              <p className="text-xs text-neutral-400 text-right">Unread</p>
            )}
          </Grid>
        </Grid>
      </button>
    </>
  );
};
