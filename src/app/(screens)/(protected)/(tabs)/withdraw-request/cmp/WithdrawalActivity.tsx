import PaginationCmp from "@/app/(screens)/(protected)/(tabs)/withdraw-request/pagination/Pagination";
import CustomImage from "@/app/components/wallet/CustomImage";
import { formatNaira } from "@/app/utils/utils";
import React, { JSX, useState } from "react";
import { CardRemoveIcon, CardSendIcon } from "@/app/icons/icons";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@radix-ui/themes";
import { useWithdrawalHistory } from "@/lib/queries";
import { WithdrawalRequest } from "@/app/api/wallet";

// Status → colour class
function statusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-warning-100 text-warning-900";
    case "approved":
    case "paid":
      return "bg-green-100 text-positive-900";
    case "rejected":
    case "failed":
      return "bg-error-100 text-error-900";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

function statusTextColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-warning-900";
    case "approved":
    case "paid":
      return "text-positive-900";
    case "rejected":
    case "failed":
      return "text-error-900";
    default:
      return "text-gray-500";
  }
}

function renderEmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-44 px-4 bg-white rounded-lg">
      <div>
        <CustomImage
          alt="empty-transactions"
          src="/icons/empty-state.svg"
          className="w-16 h-16 mb-4"
        />
      </div>
      <p className="text-gray-500 text-center text-sm md:text-base">
        You&apos;ve not made any recent <br />
        withdrawals yet
      </p>
    </div>
  );
}

function renderSkeletonLoader(): JSX.Element {
  return (
    <div className="space-y-3 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton width="40px" height="40px" />
            <div className="space-y-1">
              <Skeleton width="100px" height="12px" />
              <Skeleton width="64px" height="12px" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton width="60px" height="12px" />
            <Skeleton width="80px" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WithdrawalActivity(): React.ReactElement {
  // 1-based pages (matches the backend)
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useWithdrawalHistory({ page, limit });

  // data shape: PaginatedResponse<WithdrawalRequest> (already unwrapped by select)
  const items: WithdrawalRequest[] = (data as any)?.items ?? [];
  const totalPages = (data as any)?.total_pages ?? 1;

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-lg p-4 w-full">
        {isLoading ? (
          renderSkeletonLoader()
        ) : items.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#3B3B3B]">Recent withdrawals</h3>
            {items.map((item, index) => {
              const dateStr = format(
                parseISO(item.created_at ?? new Date().toISOString()),
                "MMM d, h:mma",
              ).toLowerCase();

              const isPendingOrApproved =
                item.status === "pending" || item.status === "approved";

              return (
                <div
                  key={item.id ?? index}
                  className="bg-white cursor-pointer p-4 w-full rounded-2xl md:rounded-none border md:border-transparent border-[#D9D9D9] grid grid-cols-3 gap-1 items-center"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div
                      className={`h-10 w-10 rounded-full grid place-items-center ${statusColor(item.status)}`}
                    >
                      {isPendingOrApproved ? (
                        <CardSendIcon width={18} height={18} />
                      ) : (
                        <CardRemoveIcon width={18} height={18} />
                      )}
                    </div>

                    <div className="grid text-left">
                      <p className="text-sm text-left font-medium text-[#3B3B3B]">
                        {formatNaira(item.amount)} {/* amount is in kobo */}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Withdrawal Request
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <p
                      className={`text-sm font-medium capitalize ${statusTextColor(item.status)}`}
                    >
                      {item.status}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 capitalize">
                      {dateStr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          renderEmptyState()
        )}
      </section>

      <PaginationCmp
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
