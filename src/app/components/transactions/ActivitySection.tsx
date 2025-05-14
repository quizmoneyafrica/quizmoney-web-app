import { FlatTransaction } from "@/app/utils/utils";
import ActivityRow from "./ActivityRow";

export default function ActivitySection({
  title,
  items,
}: {
  title: string;
  items: FlatTransaction[];
}) {
  return (
    <div className="mb-4">
      <div className="font-bold text-gray-700 mb-2">{title}</div>
      <div className="bg-white rounded">
        {items.map((activity) => (
          <ActivityRow key={activity.objectId} activity={activity} />
        ))}
      </div>
    </div>
  );
}
