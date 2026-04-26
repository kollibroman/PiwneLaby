'use client';

import { FilterState, CATEGORIES, PLAYER_COUNT_RANGES } from '@/types';

interface SidebarProps {
  filters: FilterState;
  onSearchChange: (query: string) => void;
  onCategoryToggle: (category: string) => void;
  onPlayerCountToggle: (range: string) => void;
  onClearFilters: () => void;
}

export default function Sidebar({
  filters,
  onSearchChange,
  onCategoryToggle,
  onPlayerCountToggle,
  onClearFilters,
}: SidebarProps) {
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.categories.length > 0 ||
    filters.playerCounts.length > 0;

  return (
    <aside className="bg-white rounded-lg shadow-md p-5 min-w-[250px] w-full md:w-[280px] h-fit">
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-semibold text-gray-800 mb-3">
          Szukaj po tytule
        </label>
        <input
          id="search"
          type="text"
          placeholder="Wpisz tytuł gry..."
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded outline-none focus:border-cyan-600 transition-colors"
        />
      </div>

      <div className="mb-6">
        <span className="block text-sm font-semibold text-gray-800 mb-3">Kategorie</span>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onCategoryToggle(category)}
                className="w-4 h-4 cursor-pointer accent-cyan-600"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-sm font-semibold text-gray-800 mb-3">Liczba graczy</span>
        <div className="flex flex-col gap-2.5">
          {PLAYER_COUNT_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.playerCounts.includes(range.label)}
                onChange={() => onPlayerCountToggle(range.label)}
                className="w-4 h-4 cursor-pointer accent-cyan-600"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors"
          type="button"
        >
          Wyczyść filtry
        </button>
      )}
    </aside>
  );
}
