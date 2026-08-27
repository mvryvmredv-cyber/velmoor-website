"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type PropertyVideoEditorProps = {
  video: string | null;
};

export default function PropertyVideoEditor({
  video,
}: PropertyVideoEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("PropertyVideoEditor");
  const [currentVideo, setCurrentVideo] = useState<string | null>(
    video || null,
  );

  const [newVideo, setNewVideo] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleSelectVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setNewVideo(file);
  }

  useEffect(() => {
    if (!newVideo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(newVideo);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [newVideo]);

  function removeCurrentVideo() {
    setCurrentVideo(null);
  }

  function removeNewVideo() {
    setNewVideo(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[#1b3255] dark:text-white mb-5">
        {t("propertyVideo")}
      </h2>

      {/* ================= CURRENT VIDEO ================= */}

      {currentVideo && !newVideo && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("currentVideo")}
          </h3>

          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video
              src={currentVideo}
              controls
              className="w-full max-h-[500px] object-contain"
            />

            <button
              type="button"
              onClick={removeCurrentVideo}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 text-white text-xl font-bold hover:bg-red-700 transition"
            >
              ×
            </button>

            {/* الفيديو القديم الذي سيتم الاحتفاظ به */}
            <input type="hidden" name="existing_video" value={currentVideo} />
          </div>
        </div>
      )}

      {/* ================= NEW VIDEO ================= */}

      {newVideo && previewUrl && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("newVideo")}
          </h3>

          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video
              src={previewUrl}
              controls
              className="w-full max-h-[500px] object-contain"
            />

            <button
              type="button"
              onClick={removeNewVideo}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 text-white text-xl font-bold hover:bg-red-700 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ================= FILE INPUT ================= */}

      <input
        ref={inputRef}
        type="file"
        name="new_video"
        accept="video/*"
        onChange={handleSelectVideo}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 py-8 text-center text-gray-500 dark:text-gray-400 hover:border-[#1b3255] hover:text-[#1b3255] transition"
      >
        <span className="block text-3xl mb-2">🎥</span>

        <span className="font-medium">
          {currentVideo ? t("changePropertyVideo") : t("addPropertyVideo")}
        </span>
      </button>

      {/* الفيديو الجديد الذي هيتم رفعه */}
      {newVideo && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          {t("selected")}: {newVideo.name}
        </p>
      )}
    </section>
  );
}
