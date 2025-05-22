import React from "react";
import CustomImage from "../wallet/CustomImage";
import WalletApi from "@/app/api/wallet";
import { setTransactions } from "@/app/store/walletSlice";
import { store } from "@/app/store/store";
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from "@/app/utils/utils";

enum FilterType {
  COMPLETED = "completed",
  PENDING = "pending",
  ALL = "all",
}

export function FilterBar(): React.ReactElement {
  const [selectedFilter, setSelectedFilter] = React.useState<FilterType>(FilterType.ALL);

  const handleFilter = async (query: string) => {
    // Implement filter logic here
    try {
      const response = await WalletApi.searchTransactions({
        query,
      });
      console.log("====================================");
      console.log(JSON.stringify(response, null, 2));
      console.log("====================================");
      if (response?.data?.result?.groupedTransactions) {
        store.dispatch(
          setTransactions(response?.data?.result?.groupedTransactions)
        );
      }
    } catch (error) {
      console.log(error, "ERROR FETCHING TRANSACTIONS");
    }
  };

  return (
    <div className="mb-6 flex items-center gap-3 justify-between">
      <div className="border flex-1 bg-white border-[#E4E3E3] rounded-lg px-5 flex items-center">
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
          className="focus:ring-transparent flex-1 placeholder:text-[#E4E3E3] px-3 py-2 w-full text-sm focus:outline-none"
        />
      </div>
      
      <Select.Root value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as FilterType)}>
        <Select.Trigger className="border border-[#E4E3E3] outline-none focus:ring-transparent cursor-pointer bg-white rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          <CustomImage alt="" src={"/icons/switch-icon.svg"} />
          <Select.Value placeholder="Filter By" />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white rounded-lg border border-[#E4E3E3] shadow-md">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronDownIcon className="rotate-180" />
            </Select.ScrollUpButton>
            
            <Select.Viewport className="p-2">
              {Object.values(FilterType).map((type) => (
                <Select.Item
                  key={type}
                  value={type}
                  className={cn(
                    "relative flex items-center px-8 py-2 text-sm rounded-md cursor-pointer select-none hover:bg-gray-100",
                    "data-[highlighted]:outline-none data-[highlighted]:bg-gray-100"
                  )}
                >
                  <Select.ItemText>{type.charAt(0).toUpperCase() + type.slice(1)}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default FilterBar;
