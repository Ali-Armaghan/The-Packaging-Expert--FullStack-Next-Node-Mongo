"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUploadedMedia } from "@/lib/media/clientDelete";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  square?: boolean;
  className?: string;
};

export function ImageUploadField({
  value,
  onChange,
  folder = "industries",
  label = "Upload image",
  square = false,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const previousUrl = value?.trim() || "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: { url?: string };
      };

      if (!res.ok || !data.success || !data.data?.url) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.data.url);
      if (previousUrl && previousUrl !== data.data.url) {
        void deleteUploadedMedia(previousUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    const previousUrl = value?.trim() || "";
    onChange("");
    if (previousUrl) void deleteUploadedMedia(previousUrl);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
          event.target.value = "";
        }}
      />

      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-border bg-muted/30",
            square ? "aspect-square w-28" : "h-28 w-full max-w-xs",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="size-full object-cover" />
          <Button
            type="button"
            size="icon-xs"
            variant="secondary"
            className="absolute top-1.5 right-1.5"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-foreground disabled:opacity-60",
            square ? "aspect-square w-28" : "h-28 w-full max-w-xs px-4",
          )}
        >
          {uploading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <ImagePlusIcon className="size-5" />
          )}
          <span>{uploading ? "Optimizing & uploading..." : label}</span>
        </button>
      )}

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Replace
        </Button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
