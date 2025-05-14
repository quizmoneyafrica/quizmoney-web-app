import React from "react";
import CustomImage from "../wallet/CustomImage";

export function FilterBar(): React.ReactElement {
  return (
    <div className="mb-6 flex items-center gap-3 justify-between">
      <div className=" border flex-1  bg-white border-[#E4E3E3] rounded-lg px-5 flex items-center">
        <CustomImage alt="" src={"/icons/search-normal.svg"} />
        <input
          type="text"
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
