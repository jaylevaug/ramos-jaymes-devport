import { useRef, useState } from "react";
import { ImagePlus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  storageKey: string;
  alt: string;
  className?: string;
  /** When the image is missing, show this label to admins. */
  emptyLabel?: string;
};

export function EditableImage({
  storageKey,
  alt,
  className,
  emptyLabel = "Add a photo",
}: Props) {
  const { isAdmin } = useAuth();
  const [src, setSrc] = useLocalStorage<string>(storageKey, "");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image too large for browser storage. Use < 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSrc(String(reader.result));
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-muted shadow-card", className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-accent p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/70 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">{isAdmin ? emptyLabel : "Photo coming soon"}</p>
        </div>
      )}

      {isAdmin && (
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft hover:bg-background"
            aria-label={src ? "Change photo" : "Add photo"}
          >
            {src ? <Pencil className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
          </button>
          {src && (
            <button
              onClick={() => setSrc("")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-destructive shadow-soft hover:bg-background"
              aria-label="Remove photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="absolute inset-x-3 bottom-3 rounded-md bg-destructive px-3 py-2 text-xs text-destructive-foreground shadow-soft">
          {error}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
