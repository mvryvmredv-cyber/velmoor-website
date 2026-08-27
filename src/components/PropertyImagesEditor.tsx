"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
type PropertyImagesEditorProps = {
  images: string[];
};

export default function PropertyImagesEditor({
  images,
}: PropertyImagesEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("PropertyImagesEditor");
  const [currentImages, setCurrentImages] = useState<string[]>(images);
  const [newImages, setNewImages] = useState<File[]>([]);

  // Keep the real file input synchronized with selected files
  useEffect(() => {
    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();

    newImages.forEach((file) => {
      dataTransfer.items.add(file);
    });

    inputRef.current.files = dataTransfer.files;
  }, [newImages]);

  function handleSelectImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setNewImages((prev) => {
      const existingKeys = new Set(
        prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );

      const uniqueFiles = files.filter(
        (file) =>
          !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`),
      );

      return [...prev, ...uniqueFiles];
    });
  }

  function removeCurrentImage(index: number) {
    setCurrentImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  function removeNewImage(index: number) {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
        {t("uploadImages")}
      </h2>

      {/* ================= CURRENT IMAGES ================= */}

      {currentImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("currentImages")}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800"
              >
                <img
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeCurrentImage(index)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-600 text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>

                {/* الصور القديمة التي سيتم الاحتفاظ بها */}
                <input type="hidden" name="existing_images" value={image} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= NEW IMAGES ================= */}

      {newImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("newImages")}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newImages.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800"
                >
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-600 text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ADD IMAGES ================= */}

      <div>
        <input
          ref={inputRef}
          type="file"
          name="new_images"
          accept="image/*"
          multiple
          onChange={handleSelectImages}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 py-8 text-center text-gray-500 dark:text-gray-400 hover:border-[#1b3255] hover:text-[#1b3255] transition"
        >
          <span className="block text-3xl mb-2">＋</span>

          <span className="font-medium">{t("addPropertyImages")}</span>
        </button>
      </div>
    </section>
  );
}
