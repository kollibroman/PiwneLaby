'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const hasMultipleImages = images && images.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!hasImages) {
    return (
      <div className="relative w-full pt-[75%] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-lg">Brak zdjęcia</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full pt-[75%] bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - zdjęcie ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 600px) 100vw, (max-width: 850px) 50vw, 50vw"
          priority={currentIndex === 0}
        />
      </div>

      {hasMultipleImages && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-700 text-white border-none rounded-full w-10 h-10 text-2xl font-bold cursor-pointer flex items-center justify-center opacity-90 hover:opacity-100 transition-all z-10"
            type="button"
            aria-label="Poprzednie zdjęcie"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-700 text-white border-none rounded-full w-10 h-10 text-2xl font-bold cursor-pointer flex items-center justify-center opacity-90 hover:opacity-100 transition-all z-10"
            type="button"
            aria-label="Następne zdjęcie"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
