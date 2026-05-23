'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, removeItem, clear } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-cyan-700 text-sm font-medium">← Powrót</Link>
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">Koszyk</h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
              type="button"
            >
              Wyczyść koszyk
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="mt-6 text-gray-600">Koszyk jest pusty.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border border-gray-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price.toFixed(2)} zł
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    type="button"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-base font-semibold text-gray-700">Suma</span>
              <span className="text-lg font-bold text-gray-900">{total.toFixed(2)} zł</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
