"use client";
import EmptyState from "@/app/components/notification/emptyState";
import { NotificationBox } from "@/app/components/notification/NotificationBox";
import { Grid } from "@radix-ui/themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ViewNotification from "@/app/components/notification/ViewNotification";
import { Content } from "@/app/components/notification/ViewNotification";
import QmDrawer from "@/app/components/drawer/drawer";
import NotificationApi from "@/app/api/notification";
import CustomButton from "@/app/utils/CustomBtn";

interface NotificationPage {
  content: Content[];
  pageNo: number;
  last: boolean;
}

function Page() {
  const [notifications, setNotifications] = useState<NotificationPage | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);
  const [passedNotification, setPassedNotification] = useState<Content>({
    body: "",
    opened: false,
    message: "",
    id: "",
  });
  const prevOpenRef = useRef<boolean>(false);
  const count = 10;
  const currentPage = notifications?.pageNo ?? -1;
  const hasMore = notifications ? !notifications.last : true;

  const fetchPage = useCallback(
    async (page: number) => {
      const isFirst = page === 0;
      try {
        if (isFirst) setInitialLoading(true);
        else setLoadingMore(true);

        const res = await NotificationApi.fetchNotifications(page, count);
        const data = res.data as NotificationPage;
        console.log("Notifications", data);

        if (isFirst) {
          setNotifications(data);
        } else {
          setNotifications((prev) =>
            prev
              ? {
                  ...data,
                  content: [...prev.content, ...data.content],
                }
              : data
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!notifications) fetchPage(0);
  }, [notifications, fetchPage]);

  useEffect(() => {
    // When the drawer was previously open and now closed
    if (
      prevOpenRef.current &&
      !openNotification &&
      passedNotification?.id &&
      !passedNotification.opened
    ) {
      setNotifications(null);
      fetchPage(0);
    }

    // update previous value
    prevOpenRef.current = openNotification;
  }, [
    openNotification,
    passedNotification,
    fetchPage,
  ]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    fetchPage(nextPage);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {initialLoading ? (
        <p>Loading...</p>
      ) : notifications && notifications.content.length ? (
        <div className="space-y-8">
          <QmDrawer
            open={openNotification}
            onOpenChange={setOpenNotification}
            heightClass="h-[60%] lg:h-auto"
            trigger={
              <Grid columns="1" gap="4">
                {notifications &&
                  notifications?.content?.map(
                    (notification: Content, index: number) => {
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

          {!notifications.last && (
            <div className="grid place-items-center">
              <CustomButton
                size="md"
                width="inline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </CustomButton>
            </div>
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </motion.div>
  );
}

export default Page;
