"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import type { Game } from "@/types";
import { ITEMS_PER_PAGE } from "@/types";
import { db } from "@/lib/firebase";

interface GamesPage {
  games: Game[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

interface UseGamesReturn {
  games: Game[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

function mapGame(id: string, data: DocumentData): Game {
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

export function useGames(): UseGamesReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<
    Record<number, QueryDocumentSnapshot<DocumentData> | null>
  >({});

  const countQuery = useQuery({
    queryKey: ["games-count"],
    queryFn: async () => {
      const snapshot = await getCountFromServer(collection(db, "games"));
      return snapshot.data().count;
    },
  });

  const totalPages = useMemo(() => {
    const count = countQuery.data ?? 0;
    return Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
  }, [countQuery.data]);

  const gamesQuery = useQuery<GamesPage, Error>({
    queryKey: ["games", currentPage],
    queryFn: async () => {
      const gamesRef = collection(db, "games");
      const baseQuery = query(gamesRef, orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      const cursor = pageCursors[currentPage - 1];

      const gamesQuery = cursor
        ? query(gamesRef, orderBy("createdAt", "desc"), startAfter(cursor), limit(ITEMS_PER_PAGE))
        : baseQuery;

      const snapshot = await getDocs(gamesQuery);
      const games = snapshot.docs.map((doc) => mapGame(doc.id, doc.data()));
      const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      return { games, lastDoc };
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (gamesQuery.data?.lastDoc) {
      setPageCursors((prev) => ({
        ...prev,
        [currentPage]: gamesQuery.data?.lastDoc ?? null,
      }));
    }
  }, [currentPage, gamesQuery.data?.lastDoc]);

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    games: gamesQuery.data?.games ?? [],
    isLoading: gamesQuery.isLoading || countQuery.isLoading,
    isError: gamesQuery.isError,
    error: gamesQuery.error ?? null,
    currentPage,
    totalPages,
    setPage,
  };
}
