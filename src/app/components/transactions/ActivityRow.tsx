import React from "react";
import CustomImage from "../wallet/CustomImage";

interface ActivityRowProps {
  activity: ActivityItem;
}

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
}: ActivityRowProps): React.ReactElement {
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
          <div className="font-semibold text-[#3B3B3B]">{activity.title}</div>
          <div className="text-[#6D6D6D] text-sm ">{activity.desc}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-semibold ${amountColor}`}>
          {formatAmount(activity.amount)}
        </span>
        <span className="text-xs text-[#6D6D6D]">{activity.time}</span>
      </div>
    </div>
  );
}

export default ActivityRow;
