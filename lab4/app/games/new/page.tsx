'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GameForm from '@/components/GameForm';
import { useGameMutations } from '@/hooks/useGameMutations';
import type { GameFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function NewGamePage() {
  const router = useRouter();
  const { addGame, isAdding } = useGameMutations();
  const { user } = useAuth();

  const handleSubmit = async (data: GameFormData) => {
    await addGame(data);
    router.push('/');
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Powrót do listy
          </Link>
          <h1 style={styles.title}>Dodaj nową grę</h1>
        </div>
        <div style={styles.formContainer}>
          <p style={{ marginBottom: '1rem' }}>Musisz być zalogowany, aby dodać grę.</p>
          <Link href="/auth" style={styles.backLink}>
            Przejdź do logowania
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Powrót do listy
        </Link>
        <h1 style={styles.title}>Dodaj nową grę</h1>
      </div>
      <div style={styles.formContainer}>
        <GameForm onSubmit={handleSubmit} isSubmitting={isAdding} />
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
};
