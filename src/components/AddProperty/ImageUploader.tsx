"use client";

import { useEffect, useState } from "react";

type ImageUploaderProps = {
  onImagesChange: (files: File[]) => void;
  reset?: boolean;
};

type PreviewImage = {
  file: File;
  url: string;
};

export default function ImageUploader({
  onImagesChange,
  reset = false,
}: ImageUploaderProps) {
  const [images, setImages] = useState<PreviewImage[]>([]);

  useEffect(() => {
    onImagesChange(images.map((image) => image.file));
  }, [images, onImagesChange]);

  useEffect(() => {
    if (!reset) return;

    setImages((current) => {
      current.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });

      return [];
    });
  }, [reset]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validImages = files.filter((file) => file.type.startsWith("image/"));

    const newImages = validImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);

    // يسمح باختيار نفس الصورة مرة أخرى
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const image = current[index];

      if (image) {
        URL.revokeObjectURL(image.url);
      }

      return current.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.file.name}-${image.file.lastModified}-${index}`}
              className="relative aspect-square overflow-hidden rounded-xl group"
            >
              <img
                src={image.url}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
