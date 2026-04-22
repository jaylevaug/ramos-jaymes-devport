import { useEffect, useMemo, useState, useCallback } from "react";
import { Heart, MessageCircle, Send, Trash2, Plus, X, Sparkles, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { getBrowserId, toDrivePreview } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Comment = { id: string; author: string; body: string; created_at: string };
type Evidence = {
  id: string;
  media_url: string;
  caption: string;
  created_at: string;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCode: string;
  subText: string;
  indicatorShort: string;
  cardClass: string;
};

export function EvidenceFeedModal({
  open,
  onOpenChange,
  subCode,
  subText,
  indicatorShort,
  cardClass,
}: Props) {
  const { isAdmin } = useAuth();
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const browserId = useMemo(() => (open ? getBrowserId() : ""), [open]);

  const refresh = useCallback(async () => {
    if (!browserId) return;
    const { data: rows } = await supabase
      .from("posts")
      .select("id, media_url, caption, created_at")
      .eq("indicator_key", subCode)
      .order("created_at", { ascending: false });

    const ids = (rows ?? []).map((p) => p.id);
    if (ids.length === 0) {
      setEvidences([]);
      return;
    }

    const [{ data: likes }, { data: comments }] = await Promise.all([
      supabase.from("likes").select("post_id, browser_id").in("post_id", ids),
      supabase
        .from("comments")
        .select("id, post_id, author, body, created_at")
        .in("post_id", ids)
        .order("created_at", { ascending: true }),
    ]);

    const likesByPost = new Map<string, { count: number; liked: boolean }>();
    (likes ?? []).forEach((l) => {
      const cur = likesByPost.get(l.post_id) ?? { count: 0, liked: false };
      cur.count += 1;
      if (l.browser_id === browserId) cur.liked = true;
      likesByPost.set(l.post_id, cur);
    });
    const commentsByPost = new Map<string, Comment[]>();
    (comments ?? []).forEach((c) => {
      const arr = commentsByPost.get(c.post_id) ?? [];
      arr.push({ id: c.id, author: c.author, body: c.body, created_at: c.created_at });
      commentsByPost.set(c.post_id, arr);
    });

    setEvidences(
      (rows ?? []).map((p) => ({
        ...p,
        likeCount: likesByPost.get(p.id)?.count ?? 0,
        liked: likesByPost.get(p.id)?.liked ?? false,
        comments: commentsByPost.get(p.id) ?? [],
      })),
    );
  }, [subCode, browserId]);

  useEffect(() => {
    if (!open) return;
    refresh();
    const channel = supabase
      .channel(`feed:${subCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts", filter: `indicator_key=eq.${subCode}` },
        () => refresh(),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, subCode, refresh]);

  const addEvidence = async () => {
    if (!newUrl.trim()) return;
    const { error } = await supabase
      .from("posts")
      .insert({ indicator_key: subCode, media_url: newUrl.trim(), caption: newCaption.trim() });
    if (error) {
      console.error(error);
      return;
    }
    setNewUrl("");
    setNewCaption("");
    setComposerOpen(false);
  };

  const deleteEvidence = async (id: string) => {
    if (!confirm("Delete this evidence?")) return;
    await supabase.from("posts").delete().eq("id", id);
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("browser_id", browserId);
    } else {
      await supabase.from("likes").insert({ post_id: postId, browser_id: browserId });
    }
  };

  const addComment = async (postId: string, name: string, text: string) => {
    await supabase
      .from("comments")
      .insert({ post_id: postId, author: name.trim() || "Anonymous", body: text.trim() });
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-hidden p-0 gap-0">
        <DialogHeader
          className={cn(
            "relative border-b border-border/50 p-6 pr-12 text-left text-white",
            cardClass,
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-sm font-bold text-foreground shadow-lg">
              {subCode}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                {indicatorShort}
              </p>
              <DialogTitle className="font-display text-xl leading-tight text-white">
                Evidence & Reflections
              </DialogTitle>
              <DialogDescription className="mt-1 line-clamp-2 text-xs text-white/85">
                {subText}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(92vh-7rem)] overflow-y-auto bg-muted/20">
          {isAdmin && (
            <div className="border-b border-border bg-card p-4">
              {!composerOpen ? (
                <button
                  onClick={() => setComposerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <Plus className="h-4 w-4" /> Add new evidence
                </button>
              ) : (
                <div className="space-y-3 rounded-2xl border border-border bg-background p-5 shadow-soft">
                  <div className="flex items-center gap-2 text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-base font-semibold">New evidence</h3>
                  </div>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Google Drive link (image, video, PDF, doc…)
                    </span>
                    <input
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Reflection / caption
                    </span>
                    <textarea
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      rows={3}
                      placeholder="Share your reflection on this evidence…"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setComposerOpen(false);
                        setNewUrl("");
                        setNewCaption("");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium hover:bg-accent"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button
                      onClick={addEvidence}
                      disabled={!newUrl.trim()}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-50"
                    >
                      Publish evidence
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {evidences.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 text-muted-foreground shadow-soft">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  No evidence yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isAdmin
                    ? "Add your first piece of evidence above."
                    : "Check back soon — evidence will appear here."}
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-5 p-4 sm:p-5">
              {evidences.map((ev) => (
                <EvidenceCard
                  key={ev.id}
                  evidence={ev}
                  isAdmin={isAdmin}
                  cardClass={cardClass}
                  onToggleLike={() => toggleLike(ev.id, ev.liked)}
                  onDelete={() => deleteEvidence(ev.id)}
                  onAddComment={(name, text) => addComment(ev.id, name, text)}
                  onDeleteComment={(commentId) => deleteComment(commentId)}
                />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EvidenceCard({
  evidence,
  isAdmin,
  cardClass,
  onToggleLike,
  onDelete,
  onAddComment,
  onDeleteComment,
}: {
  evidence: Evidence;
  isAdmin: boolean;
  cardClass: string;
  onToggleLike: () => void;
  onDelete: () => void;
  onAddComment: (name: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const embed = toDrivePreview(evidence.media_url);

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", cardClass)} />
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(evidence.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete evidence"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/40">
        {embed ? (
          <iframe
            src={embed}
            title={`Evidence ${evidence.id}`}
            className="h-full w-full"
            allow="autoplay"
            allowFullScreen
          />
        ) : null}
      </div>

      {evidence.caption && (
        <div className="px-5 pt-4">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
            {evidence.caption}
          </p>
        </div>
      )}

      <div className="flex items-center gap-1 px-3 py-3">
        <button
          onClick={onToggleLike}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
            evidence.liked
              ? "bg-destructive/10 text-destructive"
              : "text-muted-foreground hover:bg-muted hover:text-destructive",
          )}
          aria-label={evidence.liked ? "Unlike" : "Like"}
        >
          <Heart className={cn("h-4 w-4", evidence.liked && "fill-current")} />
          <span>{evidence.likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{evidence.comments.length}</span>
        </button>
      </div>

      {(showComments || evidence.comments.length === 0) && (
        <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
          {evidence.comments.length > 0 && (
            <ul className="mb-4 space-y-3">
              {evidence.comments.map((c) => (
                <li key={c.id} className="group flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary">
                    {c.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-sm bg-background px-4 py-2.5 shadow-sm">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{c.author}</span>
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteComment(c.id)}
                          className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              onAddComment(name, text);
              setText("");
            }}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="Your name"
              className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:w-32"
            />
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              placeholder="Share a thought…"
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </form>
        </div>
      )}
    </li>
  );
}
