'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GameForm from '@/components/GameForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGame } from '@/hooks/useGame';
import { useGameMutations } from '@/hooks/useGameMutations';
import type { GameFormData } from '@/types';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function GameEditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { game, isLoading, isError } = useGame(id);
  const { updateGame, isUpdating } = useGameMutations();

  const handleSubmit = async (data: GameFormData) => {
    await updateGame(id, data);
    router.push(`/games/${id}`);
  };

  if (isLoading) {
    return (
      <div style={styles.page}>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div style={styles.page}>
        <div style={styles.notFound}>
          <h1 style={styles.notFoundTitle}>Gra nie została znaleziona</h1>
          <p style={styles.notFoundText}>
            Gra o podanym ID nie istnieje lub została usunięta.
          </p>
          <Link href="/" style={styles.backButton}>
            Powrót do listy gier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link href={`/games/${id}`} style={styles.backLink}>
          ← Powrót do szczegółów
        </Link>
        <h1 style={styles.title}>Edytuj grę</h1>
      </div>
      <div style={styles.formContainer}>
        <GameForm game={game} onSubmit={handleSubmit} isSubmitting={isUpdating} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  backLink: {
    display: 'inline-block',
    color: '#1F91AF',
    textDecoration: 'none',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '1.75rem',
  },
  formContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  notFound: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  notFoundTitle: {
    color: '#333',
    marginBottom: '1rem',
  },
  notFoundText: {
    color: '#666',
    marginBottom: '2rem',
  },
  backButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: '#1F91AF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 500,
  },
};
