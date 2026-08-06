"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUploadedMedia } from "@/lib/media/clientDelete";
import { cn } from "@/lib/utils";

type MultiImageUploadProps = {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  className?: string;
};

export function MultiImageUpload({
  values,
  onChange,
  folder = "industries/attached",
  label = "Add images",
  className,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
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

        uploaded.push(data.data.url);
      }

      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    onChange(values.filter((item) => item !== url));
    void deleteUploadedMedia(url);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            void handleUpload(event.target.files);
          }
          event.target.value = "";
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {values.map((url) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            <Button
              type="button"
              size="icon-xs"
              variant="secondary"
              className="absolute top-1.5 right-1.5"
              onClick={() => handleRemove(url)}
              aria-label="Remove image"
            >
              <XIcon />
            </Button>
          </div>
        ))}

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-foreground disabled:opacity-60"
        >
          {uploading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <ImagePlusIcon className="size-5" />
          )}
          <span className="px-2 text-center text-xs">
            {uploading ? "Optimizing & uploading..." : label}
          </span>
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
