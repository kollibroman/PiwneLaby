'use client';

import { useGames } from '@/hooks/useGames';
import { useFilters } from '@/hooks/useFilters';
import Sidebar from '@/components/Sidebar';
import GameGrid from '@/components/GameGrid';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { games, isLoading, isError, error } = useGames();
  const {
    filters,
    setSearchQuery,
    toggleCategory,
    togglePlayerCount,
    clearFilters,
    paginatedGames,
    currentPage,
    totalPages,
    setPage,
  } = useFilters(games);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <LoadingSpinner />
        <p className="text-base text-gray-500">Ładowanie gier...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <p className="text-base text-red-600 text-center p-6 bg-red-50 rounded-lg max-w-[500px]">
          {error?.message || 'Nie udało się pobrać danych. Sprawdź połączenie internetowe.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-[1400px] mx-auto w-full box-border">
      <Sidebar
        filters={filters}
        onSearchChange={setSearchQuery}
        onCategoryToggle={toggleCategory}
        onPlayerCountToggle={togglePlayerCount}
        onClearFilters={clearFilters}
      />
      <main className="flex-1 min-w-0">
        <GameGrid games={paginatedGames} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
