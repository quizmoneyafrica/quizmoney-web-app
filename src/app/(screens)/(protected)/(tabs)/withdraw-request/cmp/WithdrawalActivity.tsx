/* eslint-disable @typescript-eslint/no-explicit-any */
import WalletApi from "@/app/api/wallet";
import PaginationCmp from "@/app/(screens)/(protected)/(tabs)/withdraw-request/pagination/Pagination";
import CustomImage from "@/app/components/wallet/CustomImage";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import React, { JSX, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { setWithdrawalRequestData } from "@/app/store/withdrawalRequestSlice";
import { CardRemoveIcon, CardSendIcon } from "@/app/icons/icons";
import { addHours, parseISO, format } from "date-fns";
import QMLoader from "@/app/components/splashScreen/QMLoader";

// interface WithdrawTransactionGroup {
//   today: Transaction[];
//   yesterday: Transaction[];
//   other: Transaction[];
// }

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

export default function WithdrawalActivity(): React.ReactElement {
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useAppDispatch();
  const withdrawData = useAppSelector((s) => s.withdrawalRequest);
  const [page, setPage] = useState(0);
  const size = 10;

  const fetchWithdrawalRequest = useCallback(
    async (pageId: number) => {
      setIsFetching(true);
      try {
        const res = await WalletApi.fetchWithdrawalRequests(pageId, size);
        dispatch(setWithdrawalRequestData(res.data));
      } catch (error: any) {
        toast.error(error.message, { position: toastPosition });
      } finally {
        setIsFetching(false);
      }
    },
    [dispatch, size]
  );

  useEffect(() => {
    fetchWithdrawalRequest(page);
  }, [fetchWithdrawalRequest, page]);

  if (isFetching) {
    return (
      <div className="pt-[10dvh] flex items-center justify-center">
        <QMLoader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-lg p-4 w-full">
        {withdrawData.content.length > 0 ? (
          <div className="space-y-4">
            <h3>Recent withdrawals</h3>
            {withdrawData.content.map((item, index) => {
              const date = parseISO(item.createdAt ?? new Date().toISOString());
              const nigeriaTime = addHours(date, 1);
              const dateData = format(
                nigeriaTime,
                "MMM d, h:mma"
              ).toLowerCase();
              return (
                <div
                  key={index}
                  className={`bg-white cursor-pointer p-4 w-full rounded-2xl md:rounded-none border md:border-transparent border-[#D9D9D9] grid grid-cols-3 gap-1 items-center`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div>
                      <div
                        className={`h-10 w-10 rounded-full grid place-items-center  ${
                          item.status === "PENDING" ||
                          item.status === "PROCESSING"
                            ? "bg-warning-100 text-warning-900"
                            : item.status === "APPROVED" ||
                              item.status === "PROCESSED"
                            ? "bg-green-100 text-positive-900"
                            : item.status === "REJECTED" ||
                              item.status === "FAILED"
                            ? "bg-error-100 text-error-900"
                            : "bg-error-100 text-error-900"
                        }`}
                      >
                        {item.status === "PENDING" ||
                        item.status === "APPROVED" ? (
                          <CardSendIcon width={18} height={18} />
                        ) : (
                          <CardRemoveIcon width={18} height={18} />
                        )}
                      </div>
                    </div>

                    <div className="grid text-left">
                      <p className="text-sm text-left font-medium text-[#3B3B3B]">
                        {formatNaira(Number(item.amount))}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Withdrawal Request
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 text-right ">
                    <p
                      className={`text-sm  font-medium ${
                        item.status === "PENDING" ||
                        item.status === "PROCESSING"
                          ? "text-warning-900"
                          : item.status === "APPROVED" ||
                            item.status === "PROCESSED"
                          ? "text-positive-900"
                          : item.status === "REJECTED" ||
                            item.status === "FAILED"
                          ? "text-error-900"
                          : "text-error-900"
                      }`}
                    >
                      {item.status}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 capitalize">
                      {dateData}
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
        totalPages={withdrawData.totalPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
}
