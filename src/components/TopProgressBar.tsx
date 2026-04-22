import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Slim top-of-page progress bar (YouTube/NProgress style).
 * Shows while `loading` is true, animates to ~90%, then completes & fades out.
 */
export function TopProgressBar({ loading, className }: { loading: boolean; className?: string }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;

    if (loading) {
      setVisible(true);
      setProgress(10);
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          // Ease towards 90%
          const inc = Math.max(1, (90 - p) * 0.08);
          return Math.min(90, p + inc);
        });
      }, 200);
    } else if (visible) {
      setProgress(100);
      hideTimeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 350);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={cn("fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent", className)}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary to-primary/70 shadow-[0_0_8px_oklch(0.55_0.22_265/0.6)] transition-[width,opacity] duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
