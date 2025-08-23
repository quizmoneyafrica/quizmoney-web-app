/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationApi from "@/app/api/notification";
import { Content } from "@/app/store/notificationSlice";
import { toastPosition } from "@/app/utils/utils";
import { Grid } from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";

interface IViewNotificationProps {
  notification: Content;
}

const ViewNotification: React.FunctionComponent<IViewNotificationProps> = ({
  notification,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [openedNotification, setOpenedNotification] = React.useState<Content>({
    body: "",
    opened: false,
    message: "",
    id: "",
  });
  React.useEffect(() => {
    const fetchOpenedNotification = async () => {
      try {
        const res = await NotificationApi.readNotification(notification.id);
        console.log(res);
        setOpenedNotification(res.data);
      } catch (err: any) {
        toast.error(err.message, { position: toastPosition });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpenedNotification();
  }, [notification.id]);
  if (isLoading) {
    return (
      <div className="mt-[30%] flex items-center justify-center ">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }
  return (
    <>
      <div>
        <Grid columns="1" align="center" justify="between">
          <div className="mt-[5%] grid grid-cols-[56px_1fr] col-span-2 gap-2">
            <div
              className={`h-12 w-12 rounded-full bg-primary-50 grid place-items-center`}
            >
              <span className="text-3xl">
                {notification.message.includes("deposit")
                  ? "💰"
                  : notification.message.includes("purchased")
                  ? "🛍"
                  : notification.message.includes("request")
                  ? "💸"
                  : "🔔 "}
              </span>
            </div>
            <Grid className="text-left w-full gap-1">
              <p className="font-bold text-primary-900">
                {(openedNotification && openedNotification?.message) || ""}
              </p>

              <span className="text-xs text-neutral-600">
                {openedNotification?.body}
              </span>
            </Grid>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default ViewNotification;
