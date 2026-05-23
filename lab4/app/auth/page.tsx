'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err) {
      setError('Nie udało się zalogować przez Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (err) {
      setError('Nie udało się zalogować. Sprawdź dane.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      router.push('/');
    } catch (err) {
      setError('Nie udało się założyć konta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link href="/" className="text-cyan-700 text-sm font-medium">← Powrót</Link>
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Logowanie</h1>
        <p className="text-sm text-gray-600 mt-2">
          Zaloguj się przez Google lub konto Email/Hasło.
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold"
          type="button"
          disabled={isSubmitting}
        >
          Zaloguj przez Google
        </button>

        <div className="my-6 border-t border-gray-200" />

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 outline-none"
              placeholder="twoj@email.pl"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 outline-none"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-lg font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              Zaloguj
            </button>
            <button
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold"
              type="button"
              onClick={handleEmailSignUp}
              disabled={isSubmitting}
            >
              Załóż konto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
