/**
 * Interfejsy i stałe dla aplikacji "Doktor Planszodziej"
 * Marketplace gier planszowych
 */

// ============================================
// Interfejsy modeli danych
// ============================================

/**
 * Model gry planszowej
 * Validates: Requirements 2.2
 */
export interface Game {
  id: string;
  title: string;
  category: string[];           // np. ["Świetne", "Karciane"]
  price: number;                // w PLN
  players: {
    min: number;
    max: number;
  };
  age: number;                  // minimalny wiek
  playTime: {
    min: number;                // w minutach
    max: number;
  };
  description: string;
  images: string[];             // URL-e obrazków
  ownerId?: string;
  ownerName?: string;
  createdAt?: number;
  updatedAt?: number;
  isSold?: boolean;
  soldTo?: string | null;
  soldAt?: number | null;
  highestBid?: number | null;
  highestBidderId?: string | null;
  highestBidderName?: string | null;
}

/**
 * Model danych formularza dodawania/edycji gry
 */
export interface GameFormData {
  title: string;
  category: string[];
  price: number;
  playersMin: number;
  playersMax: number;
  age: number;
  playTimeMin: number;
  playTimeMax: number;
  description: string;
}

/**
 * Model stanu filtrów
 * Validates: Requirements 3.2, 3.3
 */
export interface FilterState {
  searchQuery: string;
  categories: string[];         // wybrane kategorie
  playerCounts: string[];       // np. ["1-2", "3-4"]
}

// ============================================
// Stałe
// ============================================

/**
 * Dostępne kategorie gier
 * Validates: Requirements 3.2
 */
export const CATEGORIES = ["Świetne", "Karciane", "Wolne", "Dziwne"] as const;

/**
 * Zakresy liczby graczy do filtrowania
 * Validates: Requirements 3.3
 */
export const PLAYER_COUNT_RANGES = [
  { label: "1-2", min: 1, max: 2 },
  { label: "3-4", min: 3, max: 4 },
  { label: "5+", min: 5, max: Infinity },
] as const;

/**
 * Liczba elementów na stronę paginacji
 */
export const ITEMS_PER_PAGE = 10;

// ============================================
// Typy pomocnicze
// ============================================

/**
 * Typ kategorii (union type z CATEGORIES)
 */
export type Category = typeof CATEGORIES[number];

/**
 * Typ zakresu liczby graczy
 */
export type PlayerCountRange = typeof PLAYER_COUNT_RANGES[number];
