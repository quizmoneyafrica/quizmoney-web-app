import { JSX } from "react";
import CustomImage from "../wallet/CustomImage";

export const EmptyState = ({
  description,
}: {
  description: string;
}): JSX.Element => (
  <div className="flex flex-col items-center justify-center py-44 px-4 bg-white rounded-lg">
    <CustomImage
      alt="empty-transactions"
      src="/icons/empty-state.svg"
      className="w-16 h-16 mb-4"
    />
    <p className="text-gray-500 text-center text-sm md:text-base">
      {description}
    </p>
  </div>
);
