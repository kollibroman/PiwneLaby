"use client";

import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import type { Game } from "@/types";
import { db } from "@/lib/firebase";

interface UseGameReturn {
  game: Game | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

function mapGame(id: string, data: Record<string, any>): Game {
  const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : undefined;
  const updatedAt = data.updatedAt?.toMillis ? data.updatedAt.toMillis() : undefined;
  const soldAt = data.soldAt?.toMillis ? data.soldAt.toMillis() : data.soldAt ?? null;

  return {
    id,
    title: data.title,
    category: data.category || [],
    price: data.price || 0,
    players: data.players || { min: 1, max: 1 },
    age: data.age || 0,
    playTime: data.playTime || { min: 0, max: 0 },
    description: data.description || "",
    images: data.images || [],
    ownerId: data.ownerId,
    ownerName: data.ownerName,
    createdAt,
    updatedAt,
    isSold: data.isSold ?? false,
    soldTo: data.soldTo ?? null,
    soldAt,
    highestBid: data.highestBid ?? null,
    highestBidderId: data.highestBidderId ?? null,
    highestBidderName: data.highestBidderName ?? null,
  };
}

export function useGame(id: string): UseGameReturn {
  const queryResult = useQuery<Game | null, Error>({
    queryKey: ["game", id],
    queryFn: async () => {
      const docRef = doc(db, "games", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return mapGame(snapshot.id, snapshot.data());
    },
  });

  return {
    game: queryResult.data ?? null,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
  };
}
