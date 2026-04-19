import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Local-only storage hook (kept for browser-id and other client-only state). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(v));
        } catch (e) {
          console.error("localStorage write failed", e);
        }
        return v;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}

/** stable per-browser id used to dedupe likes */
export function getBrowserId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "portfolio.browser.id";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

/** Convert a Google Drive share URL to an embeddable preview URL. */
export function toDrivePreview(url: string): string {
  if (!url) return "";
  const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return url;
}

/* ---------------- Cloud-backed hooks ---------------- */

/**
 * Cloud-backed text content. Stored in `site_content` keyed by string.
 * Returns the value, a setter (admin-only writes enforced by UI), and a hydrated flag.
 */
export function useCloudText(key: string, defaultValue = "") {
  const [value, setValue] = useState<string>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.value !== undefined && data?.value !== null) setValue(data.value);
        setHydrated(true);
      });

    const channel = supabase
      .channel(`site_content:${key}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: `key=eq.${key}` },
        (payload) => {
          const next = (payload.new as { value?: string } | null)?.value;
          if (typeof next === "string") setValue(next);
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [key]);

  const save = useCallback(
    async (next: string) => {
      setValue(next);
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) console.error("site_content upsert", error);
    },
    [key],
  );

  return { value, save, hydrated };
}

/** Cloud-backed image url. Stored in `site_images`. */
export function useCloudImage(key: string) {
  const [url, setUrl] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_images")
      .select("url")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.url) setUrl(data.url);
        setHydrated(true);
      });

    const channel = supabase
      .channel(`site_images:${key}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_images", filter: `key=eq.${key}` },
        (payload) => {
          const next = (payload.new as { url?: string } | null)?.url;
          if (typeof next === "string") setUrl(next);
          if (payload.eventType === "DELETE") setUrl("");
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [key]);

  const upload = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${key}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("photos")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (upErr) {
        console.error("upload failed", upErr);
        throw upErr;
      }
      const { data: pub } = supabase.storage.from("photos").getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      const { error } = await supabase
        .from("site_images")
        .upsert(
          { key, url: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        );
      if (error) throw error;
      setUrl(publicUrl);
      return publicUrl;
    },
    [key],
  );

  const remove = useCallback(async () => {
    setUrl("");
    await supabase.from("site_images").delete().eq("key", key);
  }, [key]);

  return { url, upload, remove, hydrated };
}
