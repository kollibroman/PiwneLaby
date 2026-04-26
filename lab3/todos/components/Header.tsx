'use client';

import Link from 'next/link';

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header
      className="w-full px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <Link
        href="/"
        className="text-white text-xl font-bold hover:opacity-90 transition-opacity"
      >
        Doktor planszodziej
      </Link>

      <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Link
          href="/games/new"
          className="px-4 py-2 rounded text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-add)' }}
        >
          Dodaj nową pozycję
        </Link>

        <button
          className="px-4 py-2 rounded text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: 'var(--color-cart)' }}
        >
          Koszyk
          {cartCount > 0 && (
            <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        <button className="text-white hover:underline transition-all">
          Zaloguj/Wyloguj
        </button>
      </nav>
    </header>
  );
}
