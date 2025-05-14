// components/Pagination.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: PaginationProps): React.ReactElement {
  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <button
        className="p-2 rounded disabled:opacity-50 hover:bg-gray-100"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>
      {Array.from({ length: pageCount }).map((_, i) => (
        <button
          key={i}
          className={`w-8 h-8 rounded ${
            page === i + 1
              ? "bg-primary-800 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => onPageChange(i + 1)}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="p-2 rounded disabled:opacity-50 hover:bg-gray-100"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

export default Pagination;
