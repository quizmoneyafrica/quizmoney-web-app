"use client";
import { ApiResponse } from "@/app/api/interface";
import EmptyState from "@/app/components/notification/emptyState";
import { NotificationBox } from "@/app/components/notification/NotificationBox";
import { useAppSelector } from "@/app/hooks/useAuth";
import { Grid } from "@radix-ui/themes";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ViewNotification from "@/app/components/notification/ViewNotification";
import QmDrawer from "@/app/components/drawer/drawer";

function Page() {
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const [openNotification, setOpenNotification] = useState(false);
  const [passedNotification, setPassedNotification] = useState({});

  // console.log("Notifications: ", notifications);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {/* <ResponsiveDialog
        open={openNotification}
        onOpenChange={setOpenNotification}
        className="!min-h-[60px] pt-18 pb-10"
      >
        <ViewNotification notification={passedNotification} />
      </ResponsiveDialog> */}

      {notifications?.length < 1 ? (
        <EmptyState />
      ) : (
        <>
          <QmDrawer
            open={openNotification}
            onOpenChange={setOpenNotification}
            heightClass="h-[60%]"
            trigger={
              <Grid columns="1" gap="4">
                {notifications.map(
                  (notification: ApiResponse, index: number) => {
                    return (
                      <NotificationBox
                        key={index}
                        notification={notification}
                        setOpenNotification={setOpenNotification}
                        setPassedNotification={setPassedNotification}
                      />
                    );
                  }
                )}
              </Grid>
            }
          >
            <ViewNotification notification={passedNotification} />
          </QmDrawer>
        </>
      )}
    </motion.div>
  );
}

export default Page;
