'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="flex items-center justify-center gap-4 py-5 mt-5" aria-label="Paginacja">
      <button
        onClick={handlePrevious}
        disabled={isFirstPage}
        className={`px-5 py-2.5 text-sm font-medium border-none rounded cursor-pointer transition-colors ${
          isFirstPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 text-white hover:bg-cyan-700'
        }`}
        type="button"
        aria-label="Poprzednia strona"
      >
        Poprzednia
      </button>

      <span className="text-sm font-medium text-gray-800 min-w-[120px] text-center">
        Strona {currentPage} z {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={isLastPage}
        className={`px-5 py-2.5 text-sm font-medium border-none rounded cursor-pointer transition-colors ${
          isLastPage
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 text-white hover:bg-cyan-700'
        }`}
        type="button"
        aria-label="Następna strona"
      >
        Następna
      </button>
    </nav>
  );
}
