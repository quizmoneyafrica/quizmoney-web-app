// data/activityData.ts

import { ActivitySection } from "./ActivityRow";

export const PAGE_SIZE = 4;

export const activityData: ActivitySection[] = [
  // Today
  {
    date: "Today",
    items: [
      {
        type: "deposit",
        title: "Wallet Top up",
        desc: "You just made a new Deposit",
        amount: 12000,
        time: "Feb 12 09:00am",
      },
      {
        type: "withdrawal",
        title: "Withdrawal made",
        desc: "You just made a new Withdrawal",
        amount: -12000,
        time: "Feb 12 09:00am",
      },
      {
        type: "withdrawal",
        title: "Withdrawal made",
        desc: "You just made a new Withdrawal",
        amount: -12000,
        time: "Feb 12 09:00am",
      },
    ],
  },
  // Yesterday
  {
    date: "Yesterday",
    items: [
      {
        type: "deposit",
        title: "Wallet Top up",
        desc: "You just made a new Deposit",
        amount: 12000,
        time: "Feb 12 09:00am",
      },
      {
        type: "deposit",
        title: "Wallet Top up",
        desc: "You just made a new Deposit",
        amount: 12000,
        time: "Feb 12 09:00am",
      },
      {
        type: "withdrawal",
        title: "Withdrawal made",
        desc: "You just made a new Withdrawal",
        amount: -12000,
        time: "Feb 12 09:00am",
      },
    ],
  },
];

// Flatten activities for pagination
export const flatActivities = activityData.flatMap((section) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  section.items.map((item: any) => ({
    ...item,
    section: section.date,
  }))
);