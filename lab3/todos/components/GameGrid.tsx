'use client';

import { Game } from '@/types';
import GameCard from './GameCard';
import LoadingSpinner from './LoadingSpinner';

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  onAddToCart?: (gameId: string) => void;
}

export default function GameGrid({ games, isLoading = false, onAddToCart }: GameGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <p className="text-lg text-gray-500 text-center">Brak wyników</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
