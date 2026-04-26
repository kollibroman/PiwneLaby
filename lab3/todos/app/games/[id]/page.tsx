'use client';

import { use } from 'react';
import Link from 'next/link';
import { useGame } from '@/hooks/useGame';
import GameDetails from '@/components/GameDetails';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GameDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailsPage({ params }: GameDetailsPageProps) {
  const { id } = use(params);
  const { game, isLoading, isError } = useGame(id);

  return (
    <div style={styles.container}>
      <Link href="/" style={styles.backLink}>
        ← Powrót do listy
      </Link>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Wystąpił błąd podczas ładowania danych.</p>
        </div>
      )}

      {!isLoading && !isError && !game && (
        <div style={styles.notFoundContainer}>
          <h2 style={styles.notFoundTitle}>404 - Gra nie została znaleziona</h2>
          <p style={styles.notFoundText}>
            Gra o podanym ID nie istnieje lub została usunięta.
          </p>
          <Link href="/" style={styles.backToListButton}>
            Wróć do listy gier
          </Link>
        </div>
      )}

      {!isLoading && !isError && game && <GameDetails game={game} />}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#1F91AF',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '24px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '16px',
  },
  notFoundContainer: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  notFoundTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#212121',
    marginBottom: '16px',
  },
  notFoundText: {
    fontSize: '16px',
    color: '#757575',
    marginBottom: '24px',
  },
  backToListButton: {
    display: 'inline-block',
    backgroundColor: '#1F91AF',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '16px',
  },
};
