'use client';

import Link from 'next/link';
import { Game } from '@/types';
import ImageGallery from './ImageGallery';

interface GameDetailsProps {
  game: Game;
  onAddToCart?: () => void;
}

export default function GameDetails({ game, onAddToCart }: GameDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 flex-wrap">
      <div className="flex-1 min-w-[280px] max-w-full md:max-w-[500px]">
        <ImageGallery images={game.images} alt={game.title} />
      </div>

      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold m-0 text-gray-900">{game.title}</h1>

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

        <p className="text-base leading-relaxed text-gray-700 m-0">{game.description}</p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={onAddToCart}
            className="bg-green-500 hover:bg-green-600 text-white border-none rounded-lg py-3.5 px-7 text-base font-semibold cursor-pointer transition-colors"
            type="button"
          >
            Dodaj do koszyka
          </button>

          <Link
            href={`/games/${game.id}/edit`}
            className="inline-flex items-center justify-center bg-transparent text-cyan-600 border-2 border-cyan-600 rounded-lg py-3 px-7 text-base font-semibold no-underline hover:bg-cyan-50 transition-colors"
          >
            Edytuj
          </Link>
        </div>
      </div>
    </div>
  );
}
