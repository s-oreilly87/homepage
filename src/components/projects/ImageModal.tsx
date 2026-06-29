"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple: boolean;
}

export function ImageModal({
  src,
  alt,
  onClose,
  onNext,
  onPrev,
  hasMultiple,
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext?.();
      if (event.key === "ArrowLeft") onPrev?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-6 backdrop-blur-md transition-opacity duration-300 md:p-16"
      onClick={onClose}
    >
      <button
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        aria-label="Close modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {hasMultiple && (
        <>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onPrev?.();
            }}
            className="absolute top-1/2 left-4 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white md:left-8"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onNext?.();
            }}
            className="absolute top-1/2 right-4 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white md:right-8"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <div
        className="relative flex size-full items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-300"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}
