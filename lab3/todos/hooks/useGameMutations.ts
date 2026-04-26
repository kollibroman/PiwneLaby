"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Game, GameFormData } from "@/types";

const LOCAL_GAMES_KEY = "local-games";

interface UseGameMutationsReturn {
  addGame: (data: GameFormData) => Promise<Game>;
  updateGame: (id: string, data: GameFormData) => Promise<Game>;
  isAdding: boolean;
  isUpdating: boolean;
}

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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

function saveLocalGames(games: Game[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_GAMES_KEY, JSON.stringify(games));
}

function formDataToGame(data: GameFormData, id: string): Game {
  return {
    id,
    title: data.title,
    category: data.category,
    price: data.price,
    players: {
      min: data.playersMin,
      max: data.playersMax,
    },
    age: data.age,
    playTime: {
      min: data.playTimeMin,
      max: data.playTimeMax,
    },
    description: data.description,
    images: [],
    isLocal: true,
  };
}

export function useGameMutations(): UseGameMutationsReturn {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: GameFormData): Promise<Game> => {
      const id = generateId();
      const newGame = formDataToGame(data, id);

      const localGames = getLocalGames();
      localGames.push(newGame);
      saveLocalGames(localGames);

      return newGame;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: GameFormData;
    }): Promise<Game> => {
      const updatedGame = formDataToGame(data, id);

      const localGames = getLocalGames();
      const index = localGames.findIndex((game) => game.id === id);

      if (index !== -1) {
        localGames[index] = updatedGame;
        saveLocalGames(localGames);
      } else {
        localGames.push(updatedGame);
        saveLocalGames(localGames);
      }

      return updatedGame;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const addGame = async (data: GameFormData): Promise<Game> => {
    return addMutation.mutateAsync(data);
  };

  const updateGame = async (id: string, data: GameFormData): Promise<Game> => {
    return updateMutation.mutateAsync({ id, data });
  };

  return {
    addGame,
    updateGame,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
