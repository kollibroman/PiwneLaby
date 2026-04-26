'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Game, GameFormData, CATEGORIES } from '@/types';

const gameFormSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').min(2, 'Tytuł musi mieć min. 2 znaki').max(100, 'Max. 100 znaków'),
  category: z.array(z.string()).min(1, 'Wybierz przynajmniej jedną kategorię'),
  price: z.number({ invalid_type_error: 'Cena musi być liczbą' }).positive('Cena musi być > 0'),
  playersMin: z.number().int().min(1, 'Min. graczy >= 1'),
  playersMax: z.number().int().min(1, 'Max. graczy >= 1'),
  age: z.number().int().min(0, 'Wiek >= 0'),
  playTimeMin: z.number().int().positive('Min. czas > 0'),
  playTimeMax: z.number().int().positive('Max. czas > 0'),
  description: z.string().min(1, 'Opis jest wymagany').min(10, 'Opis musi mieć min. 10 znaków'),
}).refine(d => d.playersMax >= d.playersMin, {
  message: 'Max. graczy >= min.',
  path: ['playersMax'],
}).refine(d => d.playTimeMax >= d.playTimeMin, {
  message: 'Max. czas >= min.',
  path: ['playTimeMax'],
});

type FormErrors = Partial<Record<keyof GameFormData, string>>;

interface GameFormProps {
  game?: Game;
  onSubmit: (data: GameFormData) => void;
  isSubmitting?: boolean;
}

const initialFormData: GameFormData = {
  title: '',
  category: [],
  price: 0,
  playersMin: 1,
  playersMax: 4,
  age: 0,
  playTimeMin: 30,
  playTimeMax: 60,
  description: '',
};

export default function GameForm({ game, onSubmit, isSubmitting = false }: GameFormProps) {
  const [formData, setFormData] = useState<GameFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        category: [...game.category],
        price: game.price,
        playersMin: game.players.min,
        playersMax: game.players.max,
        age: game.age,
        playTimeMin: game.playTime.min,
        playTimeMax: game.playTime.max,
        description: game.description,
      });
    }
  }, [game]);

  const validate = useCallback((data: GameFormData): FormErrors => {
    const result = gameFormSchema.safeParse(data);
    if (result.success) return {};
    
    const fieldErrors: FormErrors = {};
    const issues = result.error?.issues || [];
    issues.forEach(err => {
      const field = err.path[0] as keyof GameFormData;
      if (!fieldErrors[field]) {
        fieldErrors[field] = err.message;
      }
    });
    return fieldErrors;
  }, []);

  useEffect(() => {
    if (submitAttempted || touched.size > 0) {
      const newErrors = validate(formData);
      const filteredErrors: FormErrors = {};
      Object.keys(newErrors).forEach(key => {
        const field = key as keyof GameFormData;
        if (submitAttempted || touched.has(field)) {
          filteredErrors[field] = newErrors[field];
        }
      });
      setErrors(filteredErrors);
    }
  }, [formData, touched, submitAttempted, validate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category],
    }));
    setTouched(prev => new Set(prev).add('category'));
  };

  const handleBlur = (field: keyof GameFormData) => {
    setTouched(prev => new Set(prev).add(field));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const isEditMode = !!game;
  const showError = (field: keyof GameFormData) => (touched.has(field) || submitAttempted) && errors[field];

  const inputClass = (field: keyof GameFormData) =>
    `w-full px-4 py-3 border-2 rounded-lg transition-colors ${
      showError(field) ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-cyan-600'
    } focus:outline-none disabled:bg-gray-100`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Tytuł *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur('title')}
          placeholder="Nazwa gry"
          disabled={isSubmitting}
          className={inputClass('title')}
        />
        {showError('title') && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <span className="block mb-2 font-medium text-gray-700">Kategoria *</span>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(category => (
            <label
              key={category}
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.category.includes(category)
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:border-cyan-400'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.category.includes(category)}
                onChange={() => handleCategoryChange(category)}
                disabled={isSubmitting}
                className="w-4 h-4 accent-cyan-600"
              />
              {category}
            </label>
          ))}
        </div>
        {showError('category') && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block mb-2 font-medium text-gray-700">Cena (PLN) *</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price || ''}
          onChange={handleChange}
          onBlur={() => handleBlur('price')}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          disabled={isSubmitting}
          className={inputClass('price')}
        />
        {showError('price') && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="playersMin" className="block mb-2 font-medium text-gray-700">Min. graczy *</label>
          <input
            type="number"
            id="playersMin"
            name="playersMin"
            value={formData.playersMin || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('playersMin')}
            min="1"
            disabled={isSubmitting}
            className={inputClass('playersMin')}
          />
          {showError('playersMin') && <p className="mt-1 text-sm text-red-500">{errors.playersMin}</p>}
        </div>
        <div>
          <label htmlFor="playersMax" className="block mb-2 font-medium text-gray-700">Max. graczy *</label>
          <input
            type="number"
            id="playersMax"
            name="playersMax"
            value={formData.playersMax || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('playersMax')}
            min="1"
            disabled={isSubmitting}
            className={inputClass('playersMax')}
          />
          {showError('playersMax') && <p className="mt-1 text-sm text-red-500">{errors.playersMax}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="age" className="block mb-2 font-medium text-gray-700">Minimalny wiek *</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ''}
          onChange={handleChange}
          onBlur={() => handleBlur('age')}
          min="0"
          disabled={isSubmitting}
          className={inputClass('age')}
        />
        {showError('age') && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="playTimeMin" className="block mb-2 font-medium text-gray-700">Min. czas (min) *</label>
          <input
            type="number"
            id="playTimeMin"
            name="playTimeMin"
            value={formData.playTimeMin || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('playTimeMin')}
            min="1"
            disabled={isSubmitting}
            className={inputClass('playTimeMin')}
          />
          {showError('playTimeMin') && <p className="mt-1 text-sm text-red-500">{errors.playTimeMin}</p>}
        </div>
        <div>
          <label htmlFor="playTimeMax" className="block mb-2 font-medium text-gray-700">Max. czas (min) *</label>
          <input
            type="number"
            id="playTimeMax"
            name="playTimeMax"
            value={formData.playTimeMax || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('playTimeMax')}
            min="1"
            disabled={isSubmitting}
            className={inputClass('playTimeMax')}
          />
          {showError('playTimeMax') && <p className="mt-1 text-sm text-red-500">{errors.playTimeMax}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Opis *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          rows={4}
          placeholder="Opisz grę (min. 10 znaków)"
          disabled={isSubmitting}
          className={inputClass('description')}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">{formData.description.length} znaków</p>
        {showError('description') && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {isSubmitting ? (isEditMode ? 'Zapisywanie...' : 'Dodawanie...') : (isEditMode ? 'Zapisz zmiany' : 'Dodaj grę')}
      </button>
    </form>
  );
}
