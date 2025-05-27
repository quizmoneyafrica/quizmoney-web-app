import { useAppDispatch } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import Parse from "parse";
import { setNextGameData } from "@/app/store/gameSlice";

function HomeQueries() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscription: any;
    const gameDataLiveQuery = async () => {
      const query = new Parse.Query("Game");
      subscription = await liveQueryClient.subscribe(query);

      subscription?.on("create", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
      subscription?.on("update", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
    };

    gameDataLiveQuery();
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [dispatch]);
  return null;
}

export default HomeQueries;
