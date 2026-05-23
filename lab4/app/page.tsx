'use client';

import { useGames } from '@/hooks/useGames';
import { useFilters } from '@/hooks/useFilters';
import Sidebar from '@/components/Sidebar';
import GameGrid from '@/components/GameGrid';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGameMutations } from '@/hooks/useGameMutations';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function Home() {
  const {
    games,
    isLoading,
    isError,
    error,
    currentPage,
    totalPages,
    setPage,
  } = useGames();
  const { buyGame } = useGameMutations();
  const { addItem } = useCart();
  const [actionError, setActionError] = useState<string | null>(null);
  const {
    filters,
    setSearchQuery,
    toggleCategory,
    togglePlayerCount,
    clearFilters,
    filteredGames,
  } = useFilters(games);

  const handleBuy = async (gameId: string) => {
    setActionError(null);
    try {
      await buyGame(gameId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Nie udało się kupić gry.');
    }
  };

  const handleAddToCart = (gameId: string) => {
    const game = games.find((item) => item.id === gameId);
    if (!game) return;
    addItem({ id: game.id, title: game.title, price: game.price });
  };

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
        {actionError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <GameGrid games={filteredGames} onBuy={handleBuy} onAddToCart={handleAddToCart} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
