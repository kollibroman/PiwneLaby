'use client';

import { useState, useMemo, useCallback } from 'react';
import { Game, FilterState, PLAYER_COUNT_RANGES } from '@/types';

export interface UseFiltersReturn {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: string) => void;
  togglePlayerCount: (range: string) => void;
  clearFilters: () => void;
  filteredGames: Game[];
}

const initialFilterState: FilterState = {
  searchQuery: '',
  categories: [],
  playerCounts: [],
};

function playerRangeOverlaps(
  gameMin: number,
  gameMax: number,
  rangeMin: number,
  rangeMax: number
): boolean {
  return gameMin <= rangeMax && gameMax >= rangeMin;
}

export function useFilters(games: Game[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const togglePlayerCount = useCallback((range: string) => {
    setFilters(prev => ({
      ...prev,
      playerCounts: prev.playerCounts.includes(range)
        ? prev.playerCounts.filter(r => r !== range)
        : [...prev.playerCounts, range],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!game.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (filters.categories.length > 0) {
        const hasMatchingCategory = game.category.some(cat =>
          filters.categories.includes(cat)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      if (filters.playerCounts.length > 0) {
        const hasMatchingPlayerCount = filters.playerCounts.some(rangeLabel => {
          const range = PLAYER_COUNT_RANGES.find(r => r.label === rangeLabel);
          if (!range) return false;
          return playerRangeOverlaps(
            game.players.min,
            game.players.max,
            range.min,
            range.max
          );
        });
        if (!hasMatchingPlayerCount) {
          return false;
        }
      }

      return true;
    });
  }, [games, filters]);

  return {
    filters,
    setSearchQuery,
    toggleCategory,
    togglePlayerCount,
    clearFilters,
    filteredGames,
  };
}
