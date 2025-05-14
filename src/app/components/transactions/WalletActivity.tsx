"use client";

import React from "react";
import FilterBar from "./FilterBar";
import ActivitySection from "./ActivitySection";
import Pagination from "./Pagination";
import { ActivityItem } from "./ActivityRow";
import { flatActivities, PAGE_SIZE } from "./activityData";

export default function WalletActivity(): React.ReactElement {
  const [page, setPage] = React.useState(1);

  const pageCount = Math.ceil(flatActivities.length / PAGE_SIZE);
  const paginated = flatActivities.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const grouped: Record<string, ActivityItem[]> = paginated.reduce(
    (acc: { [x: string]: any[] }, act: { section: any }) => {
      if (!acc[act.section!]) acc[act.section!] = [];
      acc[act.section!].push(act);
      return acc;
    },
    {} as Record<string, ActivityItem[]>
  );

  return (
    <div className="   py-5">
      <FilterBar />
      <div className=" px-5 bg-white py-5 rounded-3xl">
        {Object.entries(grouped).map(([section, items]) => (
          <ActivitySection key={section} title={section} items={items} />
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
