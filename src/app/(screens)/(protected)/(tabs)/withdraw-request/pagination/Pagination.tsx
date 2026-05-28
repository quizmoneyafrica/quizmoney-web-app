import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

type Props = {
  totalPages: number;
  currentPage: number; // 1-based
  onPageChange: (page: number) => void;
};

const PaginationCmp: React.FC<Props> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages < 1) return null;

  const goPrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <section className="flex items-center justify-end w-full">
      <div className="flex items-center justify-center space-x-2">
        {/* Previous */}
        <button
          className="bg-primary-900 p-2 rounded disabled:opacity-50"
          onClick={goPrev}
          disabled={totalPages <= 1 || currentPage <= 1}
        >
          <ArrowLeft size={14} className="text-white" />
        </button>

        {/* Page info */}
        <div className="text-sm">
          <span>{currentPage}</span> of <span>{totalPages}</span>
        </div>

        {/* Next */}
        <button
          className="bg-primary-900 p-2 rounded disabled:opacity-50"
          onClick={goNext}
          disabled={totalPages <= 1 || currentPage >= totalPages}
        >
          <ArrowRight size={14} className="text-white" />
        </button>
      </div>
    </section>
  );
};

export default PaginationCmp;
