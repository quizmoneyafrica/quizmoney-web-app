// components/ActivitySection.tsx
import React from "react";
import ActivityRow, { ActivityItem } from "./ActivityRow";

interface ActivitySectionProps {
  title: string;
  items: ActivityItem[];
}

export function ActivitySection({
  title,
  items,
}: ActivitySectionProps): React.ReactElement {
  return (
    <div className="mb-4">
      <div className="font-bold text-gray-700 mb-2">{title}</div>
      <div className="bg-white rounded">
        {items.map((activity, idx) => (
          <ActivityRow key={idx} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default ActivitySection;
