"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  imageAlt: string;
  downloadImage: string;
};

export default function PropertyImageGallery({
  images,
  imageAlt,
  downloadImage,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1,
    );
  };

  const showNext = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1,
    );
  };

  return (
    <>
      {/* Images */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="block w-full cursor-zoom-in"
                aria-label={`${imageAlt} ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${imageAlt} ${index + 1}`}
                  className="w-full h-72 md:h-80 object-cover transition duration-300 hover:scale-[1.02]"
                />
              </button>

              <a
                href={`/api/properties/download?url=${encodeURIComponent(image)}`}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-[#1b3255] text-white px-4 py-3 text-sm font-semibold shadow-lg hover:bg-[#142844] transition"
                onClick={(e) => e.stopPropagation()}
              >
                ⬇️ {downloadImage}
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X size={25} />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrevious();
              }}
              className="absolute left-4 md:left-8 z-20 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex]}
              alt={`${imageAlt} ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 md:right-8 z-20 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
