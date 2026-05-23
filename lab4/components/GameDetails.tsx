'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import ImageGallery from './ImageGallery';

interface GameDetailsProps {
  game: Game;
  onBuy?: () => void;
  onDelete?: () => void;
  onPlaceBid?: (amount: number) => void;
  canEdit?: boolean;
  canBuy?: boolean;
  isBuying?: boolean;
  isDeleting?: boolean;
  isBidding?: boolean;
}

export default function GameDetails({
  game,
  onBuy,
  onDelete,
  onPlaceBid,
  canEdit = false,
  canBuy = false,
  isBuying = false,
  isDeleting = false,
  isBidding = false,
}: GameDetailsProps) {
  const [bidAmount, setBidAmount] = useState(() => (game.highestBid ?? game.price) + 1);
  const isSold = Boolean(game.isSold);

  useEffect(() => {
    setBidAmount((game.highestBid ?? game.price) + 1);
  }, [game.highestBid, game.price]);

  const handleBid = () => {
    if (onPlaceBid) {
      onPlaceBid(bidAmount);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 flex-wrap">
      <div className="flex-1 min-w-[280px] max-w-full md:max-w-[500px]">
        <ImageGallery images={game.images} alt={game.title} />
      </div>

      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold m-0 text-gray-900">{game.title}</h1>
          {isSold && (
            <span className="text-xs font-semibold uppercase bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              Sprzedana
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {game.category.map((cat) => (
            <span key={cat} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {cat}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Liczba graczy:</span>
            <span className="font-semibold text-gray-900 text-sm">
              {game.players.min} - {game.players.max}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Wiek:</span>
            <span className="font-semibold text-gray-900 text-sm">{game.age}+</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Czas gry:</span>
            <span className="font-semibold text-gray-900 text-sm">
              {game.playTime.min} - {game.playTime.max} min
            </span>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-3xl font-bold text-cyan-600">{game.price.toFixed(2)} zł</span>
        </div>

        {game.highestBid && (
          <div className="text-sm text-gray-600">
            Najwyższa oferta: <span className="font-semibold">{game.highestBid.toFixed(2)} zł</span>
            {game.highestBidderName && (
              <span className="text-gray-500"> ( {game.highestBidderName} )</span>
            )}
          </div>
        )}

        <p className="text-base leading-relaxed text-gray-700 m-0">{game.description}</p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={onBuy}
            className={`border-none rounded-lg py-3.5 px-7 text-base font-semibold transition-colors ${
              isSold || !canBuy
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
            }`}
            type="button"
            disabled={isSold || !canBuy || isBuying}
          >
            {isSold ? 'Niedostępna' : isBuying ? 'Kupuję...' : 'Kup teraz'}
          </button>

          {canEdit && (
            <>
              <Link
                href={`/games/${game.id}/edit`}
                className="inline-flex items-center justify-center bg-transparent text-cyan-600 border-2 border-cyan-600 rounded-lg py-3 px-7 text-base font-semibold no-underline hover:bg-cyan-50 transition-colors"
              >
                Edytuj
              </Link>
              <button
                onClick={onDelete}
                className="inline-flex items-center justify-center bg-red-50 text-red-600 border-2 border-red-500 rounded-lg py-3 px-7 text-base font-semibold hover:bg-red-100 transition-colors"
                type="button"
                disabled={isDeleting}
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </button>
            </>
          )}
        </div>

        {!isSold && !canEdit && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Złóż ofertę licytacji (ACID - transakcja w Firestore).
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min={(game.highestBid ?? game.price) + 1}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-cyan-600 outline-none"
                disabled={!canBuy || isBidding}
              />
              <button
                onClick={handleBid}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors"
                type="button"
                disabled={!canBuy || isBidding}
              >
                {isBidding ? 'Licytuję...' : 'Licytuj'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
