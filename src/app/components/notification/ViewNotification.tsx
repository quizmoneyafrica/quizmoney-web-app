import { ApiResponse } from "@/app/api/interface";
import { formatDateTime } from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
import * as React from "react";

interface IViewNotificationProps {
  notification: ApiResponse;
}

const ViewNotification: React.FunctionComponent<IViewNotificationProps> = ({
  notification,
}) => {
  const { time, fullDate } = formatDateTime(notification.createdAt);
  return (
    <>
      <div>
        <Grid columns="1" align="center" justify="between">
          <div className="grid grid-cols-[56px_1fr] col-span-2 gap-2 items-center">
            <div className={`h-14 w-14 rounded-full bg-positive-50`}></div>
            <Grid className="text-left w-full">
              <Flex justify="between" align="center">
                <p className="font-bold">{notification.message}</p>
                {/* Right  */}
                <Grid gap="2" align="center" justify="end">
                  <Flex
                    direction="column"
                    align="end"
                    justify="end"
                    className="text-neutral-600 text-sm"
                  >
                    <span>{time}</span>
                    <Flex align="center" gap="2">
                      <span>{fullDate}</span>
                    </Flex>
                  </Flex>
                </Grid>
              </Flex>
            </Grid>
          </div>
          <div className="grid grid-cols-[56px_1fr] col-span-2 gap-2 items-center">
            <div></div>
            <span className="text-xs text-neutral-600">
              {notification.mainText}
            </span>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default ViewNotification;
