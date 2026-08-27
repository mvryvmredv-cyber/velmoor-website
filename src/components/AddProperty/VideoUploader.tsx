"use client";

import { useEffect, useState } from "react";

type VideoUploaderProps = {
  onVideoChange: (file: File | null) => void;
  reset?: boolean;
};

export default function VideoUploader({
  onVideoChange,
  reset = false,
}: VideoUploaderProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!video) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(video);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [video]);

  useEffect(() => {
    if (!reset) return;

    setVideo(null);
    onVideoChange(null);
  }, [reset, onVideoChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      return;
    }

    setVideo(file);
    onVideoChange(file);

    event.target.value = "";
  };

  const removeVideo = () => {
    setVideo(null);
    onVideoChange(null);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3"
      />

      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video
            src={previewUrl}
            controls
            playsInline
            className="w-full max-h-[450px] object-contain"
          />

          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-600 text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
