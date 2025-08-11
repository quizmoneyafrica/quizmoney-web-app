// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { liveQueryClient } from "@/app/api/parse/parseClient";
// import { useAppDispatch } from "@/app/hooks/useAuth";
// import Parse from "parse";
// import { useCallback, useEffect } from "react";
// import LeaderboardAPI from "../leaderboardApi";
// import {
//   setAllTimeLeaderboard,
//   setLastGameLeaderboard,
// } from "@/app/store/leaderboardSlice";

// function LeaderboardQueries() {
//   const dispatch = useAppDispatch();

//   const getLastGameLeaderboard = useCallback(async () => {
//     const res = await LeaderboardAPI.getLastGameLeaderboard(dispatch);
//     console.log("LEADERBOARD USER", res);
//     dispatch(
//       setLastGameLeaderboard({
//         createdAt: res.createdAt,
//         gameId: res.gameId,
//         msg: res.msg,
//         objectId: res.objectId,
//         rankings: res.rankings,
//         updatedAt: res.updatedAt,
//         userLastGameStats: res.userLastGameStats,
//         users: res.users,
//       })
//     );
//   }, [dispatch]);
//   const getAllTimeLeaderboard = useCallback(async () => {
//     const res = await LeaderboardAPI.getAllTimeLeaderboard(dispatch, 1);
//     dispatch(
//       setAllTimeLeaderboard({
//         page: 1,
//         data: {
//           currentPage: res.currentPage,
//           leaderboard: res.leaderboard,
//           limit: res.limit,
//           total: res.total,
//           totalPages: res.totalPages,
//         },
//       })
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     let leaderboardSubscription: any;

//     const leaderboardLiveQuery = async () => {
//       const query = new Parse.Query("Leaderboard");
//       leaderboardSubscription = await liveQueryClient.subscribe(query);

//       leaderboardSubscription?.on("create", () => {
//         getLastGameLeaderboard();
//         getAllTimeLeaderboard();
//       });
//       leaderboardSubscription?.on("update", () => {
//         getLastGameLeaderboard();
//         getAllTimeLeaderboard();
//       });
//     };

//     leaderboardLiveQuery();
//     return () => {
//       if (leaderboardSubscription) leaderboardSubscription.unsubscribe();
//     };
//   }, [dispatch, getAllTimeLeaderboard, getLastGameLeaderboard]);
//   return null;
// }

// export default LeaderboardQueries;
