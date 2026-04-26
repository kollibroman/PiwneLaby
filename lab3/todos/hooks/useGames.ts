"use client";

import { useQuery } from "@tanstack/react-query";
import type { Game } from "@/types";

const API_URL = "https://szandala.github.io/piwo-api/board-games.json";
const LOCAL_GAMES_KEY = "local-games";

const MOCK_GAMES: Game[] = [
  {
    id: "1",
    title: "Catan",
    category: ["Świetne"],
    price: 149.99,
    players: { min: 3, max: 4 },
    age: 10,
    playTime: { min: 60, max: 120 },
    description: "Klasyczna gra osadnicza, w której budujesz osady i handlujesz surowcami.",
    images: [],
  },
  {
    id: "2",
    title: "Splendor",
    category: ["Karciane", "Świetne"],
    price: 129.99,
    players: { min: 2, max: 4 },
    age: 10,
    playTime: { min: 30, max: 45 },
    description: "Gra o zbieraniu klejnotów i budowaniu prestiżu.",
    images: [],
  },
  {
    id: "3",
    title: "Dixit",
    category: ["Karciane", "Dziwne"],
    price: 119.99,
    players: { min: 3, max: 6 },
    age: 8,
    playTime: { min: 30, max: 60 },
    description: "Kreatywna gra opowiadania historii za pomocą pięknych ilustracji.",
    images: [],
  },
  {
    id: "4",
    title: "Agricola",
    category: ["Wolne", "Świetne"],
    price: 199.99,
    players: { min: 1, max: 5 },
    age: 12,
    playTime: { min: 90, max: 150 },
    description: "Strategiczna gra o zarządzaniu farmą w średniowiecznej Europie.",
    images: [],
  },
  {
    id: "5",
    title: "Azul",
    category: ["Świetne"],
    price: 159.99,
    players: { min: 2, max: 4 },
    age: 8,
    playTime: { min: 30, max: 45 },
    description: "Piękna gra abstrakcyjna o układaniu wzorów z płytek.",
    images: [],
  },
];

interface UseGamesReturn {
  games: Game[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

function getLocalGames(): Game[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_GAMES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function fetchGames(): Promise<Game[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.warn("API nie odpowiada, używam danych mockowych");
      return MOCK_GAMES;
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    if (data && Array.isArray(data.games) && data.games.length > 0) {
      return data.games;
    }
    console.warn("API zwróciło pustą odpowiedź, używam danych mockowych");
    return MOCK_GAMES;
  } catch (err) {
    console.warn("Błąd pobierania z API, używam danych mockowych:", err);
    return MOCK_GAMES;
  }
}

export function useGames(): UseGamesReturn {
  const {
    data: apiGames = [],
    isLoading,
    isError,
    error,
  } = useQuery<Game[], Error>({
    queryKey: ["games"],
    queryFn: fetchGames,
    staleTime: 5 * 60 * 1000,
  });


  const localGames = getLocalGames();
  const games = [...apiGames, ...localGames];

  return {
    games,
    isLoading,
    isError,
    error: error ?? null,
  };
}
