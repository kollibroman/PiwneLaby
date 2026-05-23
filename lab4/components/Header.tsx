'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const { user, isLoading, signOutUser } = useAuth();
  const { itemCount } = useCart();
  const displayName = user?.displayName || user?.email || 'Użytkownik';

  const handleSignOut = async () => {
    await signOutUser();
  };

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
          href={user ? '/games/new' : '/auth'}
          className={`px-4 py-2 rounded text-white font-medium hover:opacity-90 transition-opacity ${
            !user ? 'opacity-70' : ''
          }`}
          style={{ backgroundColor: 'var(--color-add)' }}
        >
          Dodaj nową pozycję
        </Link>

        <Link
          href="/cart"
          className="px-4 py-2 rounded text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: 'var(--color-cart)' }}
        >
          Koszyk
          {itemCount > 0 && (
            <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </Link>

        {!isLoading && user && (
          <span className="text-white text-sm font-medium">Witaj, {displayName}</span>
        )}

        {!isLoading && !user && (
          <Link href="/auth" className="text-white hover:underline transition-all">
            Zaloguj się
          </Link>
        )}

        {!isLoading && user && (
          <button
            onClick={handleSignOut}
            className="text-white hover:underline transition-all"
            type="button"
          >
            Wyloguj się
          </button>
        )}
      </nav>
    </header>
  );
}
