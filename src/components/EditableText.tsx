import { useEffect, useRef, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCloudText } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  storageKey: string;
  defaultValue?: string;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  paragraphClassName?: string;
};

export function EditableText({
  storageKey,
  defaultValue = "",
  multiline = false,
  placeholder = "Empty",
  className,
  as = "p",
  paragraphClassName,
}: Props) {
  const { isAdmin } = useAuth();
  const { value: stored, save, hydrated } = useCloudText(storageKey, defaultValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const inRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      const el = multiline ? taRef.current : inRef.current;
      el?.focus();
    }
  }, [editing, multiline]);

  const value = hydrated ? stored : defaultValue;

  if (editing) {
    return (
      <div className={cn("relative", className)}>
        {multiline ? (
          <textarea
            ref={taRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(4, draft.split("\n").length + 1)}
            className="w-full rounded-xl border border-primary/40 bg-background p-4 text-base leading-relaxed text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Use a blank line to separate paragraphs."
          />
        ) : (
          <input
            ref={inRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-primary/40 bg-background px-4 py-2 text-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        )}
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <button
            onClick={async () => {
              await save(draft);
              setEditing(false);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = !value || value.trim().length === 0;
  const Wrapper = as as keyof React.JSX.IntrinsicElements;

  const content = isEmpty ? (
    <Wrapper className={cn("italic text-muted-foreground/60", paragraphClassName)}>
      {isAdmin ? `${placeholder} — click pencil to add.` : placeholder}
    </Wrapper>
  ) : multiline ? (
    <>
      {value
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <Wrapper key={i} className={paragraphClassName}>
            {p}
          </Wrapper>
        ))}
    </>
  ) : (
    <Wrapper className={paragraphClassName}>{value}</Wrapper>
  );

  return (
    <div className={cn("group relative", className)}>
      {content}
      {isAdmin && (
        <button
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 shadow-soft transition-opacity hover:text-primary group-hover:opacity-100"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
