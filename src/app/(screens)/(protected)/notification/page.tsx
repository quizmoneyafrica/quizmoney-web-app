"use client";
import Parse, { liveQueryClient } from "@/app/api/parse/parseClient";
import React, { useEffect } from "react";

function Page() {
  useEffect(() => {
    const NotificationLiveQuery = async () => {
      const query = new Parse.Query("Notification");
      const subscription = liveQueryClient.subscribe(query);

      subscription?.on("update", (object) => {
        console.log("this object was updated: ", object.toJSON());
        // dispatch(setNextGameData(object.toJSON()));
      });
    };

    NotificationLiveQuery();
  }, []);
  return <div></div>;
}

export default Page;
