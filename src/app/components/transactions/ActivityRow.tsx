import React from "react";
import CustomImage from "../wallet/CustomImage";
import { FlatTransaction } from "@/app/utils/utils";

export interface ActivityItem {
  type: "deposit" | "withdrawal";
  title: string;
  desc: string;
  amount: number;
  time: string;
  section?: string;
}

export interface ActivitySection {
  date: string;
  items: ActivityItem[];
}

export function formatAmount(amount: number): string {
  const sign = amount > 0 ? "+" : "-";
  return `${sign} ₦${Math.abs(amount).toLocaleString()}`;
}
export function ActivityRow({
  activity,
}: {
  activity: FlatTransaction;
}): React.ReactElement {
  const iconBg =
    activity.type === "deposit"
      ? "bg-green-100 text-green-500"
      : "bg-red-100 text-red-500";
  const amountColor =
    activity.type === "deposit" ? "text-green-600" : "text-red-600";

  return (
    <div className="flex items-center justify-between py-4 border-b border-b-[#D9D9D9] last:border-b-0">
      <div className="flex items-center gap-4">
        <span
          className={`w-8 h-8 flex items-center justify-center rounded-full ${iconBg}`}
        >
          {activity.type === "deposit" ? (
            <CustomImage
              alt="arrow-up"
              src="/icons/arrow-down-green.svg"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          ) : (
            <CustomImage
              alt="arrow-up"
              src="/icons/arrow-down-red.svg"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          )}
        </span>
        <div>
          <div className="font-semibold">{activity.title}</div>
          <div className="text-gray-400 text-sm">{activity.description}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-semibold ${amountColor}`}>
          {formatAmount(activity.amount)}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(activity.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default ActivityRow;
