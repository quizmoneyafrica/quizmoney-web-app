import React from "react";
import CustomImage from "../wallet/CustomImage";
import WalletApi from "@/app/api/wallet";
import { setTransactions } from "@/app/store/walletSlice";
import { store } from "@/app/store/store";

export function FilterBar(): React.ReactElement {
  const handleFilter = async (query: string) => {
    // Implement filter logic here
    try {
      const response = await WalletApi.searchTransactions({
        query,
      });
      console.log("================groupedTransactions====================");
      console.log(JSON.stringify(response?.data?.result));
      console.log("==============groupedTransactions======================");
      let hhhh = {
        message: "Transactions fetched successfully",
        totalResults: 1,
        totalPages: 1,
        currentPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
        totalTransactions: [
          {
            amount: 1000,
            title: "Wallet top-up",
            description: "Funds added to your wallet.",
            type: "deposit",
            status: "completed",
            user: {
              __type: "Pointer",
              className: "_User",
              objectId: "onTMPRs1WN",
            },
            createdAt: "2025-05-17T00:10:12.780Z",
            updatedAt: "2025-05-17T00:10:12.780Z",
            objectId: "mDdXmBZECP",
            __type: "Object",
            className: "UserWalletTransaction",
          },
        ],
      };

      let dd = {
        message: "Transactions fetched successfully",
        groupedTransactions: [
          {
            date: "2025-05-17",
            transactions: [
              {
                amount: 1000,
                title: "Wallet top-up",
                description: "Funds added to your wallet.",
                type: "deposit",
                status: "completed",
                user: {
                  __type: "Pointer",
                  className: "_User",
                  objectId: "onTMPRs1WN",
                },
                createdAt: "2025-05-17T00:10:12.780Z",
                updatedAt: "2025-05-17T00:10:12.780Z",
                objectId: "mDdXmBZECP",
                __type: "Object",
                className: "UserWalletTransaction",
              },
            ],
          },
        ],
        totalTransactions: 1,
        totalPages: 1,
        currentPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };
      if (response?.data?.result?.groupedTransactions) {
        store.dispatch(
          setTransactions(response?.data?.result?.groupedTransactions)
        );
      }
    } catch (error) {}
  };
  return (
    <div className="mb-6 flex items-center gap-3 justify-between">
      <div className=" border flex-1  bg-white border-[#E4E3E3] rounded-lg px-5 flex items-center">
        <CustomImage alt="" src={"/icons/search-normal.svg"} />
        <input
          onChange={(e) => handleFilter(e.target.value)}
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Search"
          className=" focus:ring-transparent flex-1 placeholder:text-[#E4E3E3]  px-3 py-2 w-full text-sm focus:outline-none"
        />
      </div>
      <button className="border border-[#E4E3E3] outline-none focus:ring-transparent cursor-pointer bg-white rounded-lg px-4 py-2 text-sm flex items-center gap-2">
        <CustomImage alt="" src={"/icons/switch-icon.svg"} />
        Filter By
      </button>
    </div>
  );
}

export default FilterBar;
