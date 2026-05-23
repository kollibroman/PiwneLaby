'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onBuy?: (gameId: string) => void;
  onAddToCart?: (gameId: string) => void;
}

export default function GameCard({ game, onBuy, onAddToCart }: GameCardProps) {
  const hasImage = game.images && game.images.length > 0;
  const imageUrl = hasImage ? game.images[0] : null;
  const firstCategory = game.category && game.category.length > 0 ? game.category[0] : 'Brak kategorii';
  const isSold = Boolean(game.isSold);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuy) {
      onBuy(game.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(game.id);
    }
  };

  return (
    <Link href={`/games/${game.id}`} className="block w-full no-underline text-inherit">
      <article className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer flex flex-col h-full ${
        isSold ? 'opacity-70' : ''
      }`}>
        <div className="relative w-full pt-[75%] bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={game.title}
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, (max-width: 850px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-sm">Brak zdjęcia</span>
            </div>
          )}
          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full text-sm">
                Sprzedana
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col gap-2 flex-grow">
          <h3 className="m-0 text-base font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
            {game.title}
          </h3>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded self-start">
            {firstCategory}
          </span>
          <span className="text-lg font-bold text-cyan-600 mt-auto">
            {game.price.toFixed(2)} zł
          </span>
          
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={handleBuy}
              className={`border-none rounded py-2.5 px-4 text-sm font-medium transition-colors ${
                isSold
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              }`}
              type="button"
              disabled={isSold}
            >
              {isSold ? 'Niedostępna' : 'Kup teraz'}
            </button>
            <button
              onClick={handleAddToCart}
              className={`border rounded py-2 px-4 text-sm font-medium transition-colors ${
                isSold
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-cyan-600 hover:text-cyan-700'
              }`}
              type="button"
              disabled={isSold}
            >
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
