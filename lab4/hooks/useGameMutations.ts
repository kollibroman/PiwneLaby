"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Game, GameFormData } from "@/types";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

interface UseGameMutationsReturn {
  addGame: (data: GameFormData) => Promise<Game>;
  updateGame: (id: string, data: GameFormData) => Promise<Game>;
  deleteGame: (id: string) => Promise<void>;
  buyGame: (id: string) => Promise<void>;
  placeBid: (id: string, amount: number) => Promise<void>;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isBuying: boolean;
  isBidding: boolean;
}

function formDataToGame(data: GameFormData, ownerId: string, ownerName: string) {
  return {
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
    ownerId,
    ownerName,
    isSold: false,
    soldTo: null,
    soldAt: null,
    highestBid: null,
    highestBidderId: null,
    highestBidderName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function useGameMutations(): UseGameMutationsReturn {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const requireUser = () => {
    if (!user) {
      throw new Error("Zaloguj się, aby wykonać tę akcję.");
    }
    return user;
  };

  const addMutation = useMutation({
    mutationFn: async (data: GameFormData): Promise<Game> => {
      const currentUser = requireUser();
      const ownerName = currentUser.displayName || currentUser.email || "Użytkownik";
      const docRef = await addDoc(
        collection(db, "games"),
        formDataToGame(data, currentUser.uid, ownerName)
      );
      const snapshot = await getDoc(docRef);
      return { id: snapshot.id, ...(snapshot.data() as Omit<Game, "id">) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["games-count"] });
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
      const currentUser = requireUser();
      const docRef = doc(db, "games", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        throw new Error("Gra nie istnieje.");
      }
      if (snapshot.data().ownerId !== currentUser.uid) {
        throw new Error("Nie masz uprawnień do edycji tej gry.");
      }
      await updateDoc(docRef, {
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
        updatedAt: serverTimestamp(),
      });
      const updatedSnapshot = await getDoc(docRef);
      return { id: updatedSnapshot.id, ...(updatedSnapshot.data() as Omit<Game, "id">) };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const currentUser = requireUser();
      const docRef = doc(db, "games", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        throw new Error("Gra nie istnieje.");
      }
      if (snapshot.data().ownerId !== currentUser.uid) {
        throw new Error("Nie masz uprawnień do usunięcia tej gry.");
      }
      await deleteDoc(docRef);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["games-count"] });
      queryClient.invalidateQueries({ queryKey: ["game", id] });
    },
  });

  const buyMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const currentUser = requireUser();
      const docRef = doc(db, "games", id);

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(docRef);
        if (!snapshot.exists()) {
          throw new Error("Gra nie istnieje.");
        }
        const data = snapshot.data();
        if (data.isSold) {
          throw new Error("Ta oferta jest już niedostępna.");
        }
        if (data.ownerId === currentUser.uid) {
          throw new Error("Nie możesz kupić własnej gry.");
        }

        transaction.update(docRef, {
          isSold: true,
          soldTo: currentUser.uid,
          soldAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", id] });
    },
  });

  const bidMutation = useMutation({
    mutationFn: async ({
      id,
      amount,
    }: {
      id: string;
      amount: number;
    }): Promise<void> => {
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Podaj poprawną kwotę licytacji.");
      }
      const currentUser = requireUser();
      const docRef = doc(db, "games", id);

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(docRef);
        if (!snapshot.exists()) {
          throw new Error("Gra nie istnieje.");
        }
        const data = snapshot.data();
        if (data.isSold) {
          throw new Error("Ta oferta jest już niedostępna.");
        }
        const minBid = data.highestBid ?? data.price ?? 0;
        if (amount <= minBid) {
          throw new Error(`Oferta musi być większa niż ${minBid} zł.`);
        }

        transaction.update(docRef, {
          highestBid: amount,
          highestBidderId: currentUser.uid,
          highestBidderName: currentUser.displayName || currentUser.email || "Użytkownik",
          updatedAt: serverTimestamp(),
        });
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.id] });
    },
  });

  return {
    addGame: (data) => addMutation.mutateAsync(data),
    updateGame: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteGame: (id) => deleteMutation.mutateAsync(id),
    buyGame: (id) => buyMutation.mutateAsync(id),
    placeBid: (id, amount) => bidMutation.mutateAsync({ id, amount }),
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBuying: buyMutation.isPending,
    isBidding: bidMutation.isPending,
  };
}
