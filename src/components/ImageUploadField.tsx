"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useToast } from "@/context/ToastContext";
import { fileToResizedDataUrl } from "@/lib/image";

export function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}) {
  const { dict } = useLocale();
  const { show } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      show(dict.admin.imageTooLarge, "error");
      return;
    }
    const dataUrl = await fileToResizedDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div>
      {label && <span className="mb-1 block text-xs font-medium text-muted">{label}</span>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-3 transition-colors ${
          dragOver ? "border-brown-500 bg-tint" : "border-line hover:border-brown-400"
        }`}
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <span className="text-xs text-muted">
          {value ? dict.admin.replaceImage : dict.admin.dropImageHint}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
