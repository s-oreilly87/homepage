"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageModal } from "@/components/projects/ImageModal";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const next = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      next(event);
      return;
    }

    if (event.key === "ArrowLeft") {
      prev(event);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
      event.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        className="relative mb-6 group z-10 focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Image carousel for ${alt}. Use arrow keys to navigate.`}
      >
        <div
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setShowModal(true);
          }}
          className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-line/50 cursor-zoom-in"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} screenshot ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={i === 0}
              />
            </div>
          ))}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((src, i) => (
                <div
                  key={src}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index ? "bg-white w-3" : "bg-white/40 w-1"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              tabIndex={-1}
              className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/15 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent/50 outline-none"
              aria-label="Previous image"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              tabIndex={-1}
              className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/15 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent/50 outline-none"
              aria-label="Next image"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {showModal &&
        createPortal(
          <ImageModal
            src={images[index]}
            alt={alt}
            onClose={() => setShowModal(false)}
            onNext={images.length > 1 ? () => next() : undefined}
            onPrev={images.length > 1 ? () => prev() : undefined}
            hasMultiple={images.length > 1}
          />,
          document.body,
        )}
    </>
  );
}
