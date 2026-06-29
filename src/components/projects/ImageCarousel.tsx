"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageModal } from "@/components/projects/ImageModal";
import { Chevron } from "@/components/icons";

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
        className="group relative z-10 mb-6 focus:outline-none"
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
          className="relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl border border-line/50 bg-black"
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
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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
              className="absolute top-1/2 left-0 z-10 flex size-8 -translate-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-100 backdrop-blur-md transition-all outline-none hover:bg-black/60 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent/50 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <Chevron direction="left" size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={next}
              tabIndex={-1}
              className="absolute top-1/2 right-0 z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-100 backdrop-blur-md transition-all outline-none hover:bg-black/60 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent/50 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
              aria-label="Next image"
            >
              <Chevron direction="right" size={14} strokeWidth={2.5} />
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
