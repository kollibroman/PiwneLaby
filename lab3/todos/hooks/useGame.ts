"use client";

import type { Game } from "@/types";
import { useGames } from "./useGames";

interface UseGameReturn {
  game: Game | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}


export function useGame(id: string): UseGameReturn {
  const { games, isLoading, isError, error } = useGames();

  const game = games.find((g) => g.id === id) ?? null;

  return {
    game,
    isLoading,
    isError,
    error,
  };
}
