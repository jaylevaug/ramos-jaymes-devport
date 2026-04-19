import { useEffect, useMemo, useState, useCallback } from "react";
import { Heart, MessageCircle, Send, Trash2, Plus, X } from "lucide-react";
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
type Post = {
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const browserId = useMemo(() => (open ? getBrowserId() : ""), [open]);

  const refresh = useCallback(async () => {
    if (!browserId) return;
    const { data: postRows } = await supabase
      .from("posts")
      .select("id, media_url, caption, created_at")
      .eq("indicator_key", subCode)
      .order("created_at", { ascending: false });

    const ids = (postRows ?? []).map((p) => p.id);
    if (ids.length === 0) {
      setPosts([]);
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

    setPosts(
      (postRows ?? []).map((p) => ({
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

  const addPost = async () => {
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

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-5 pr-12 text-left">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                cardClass,
              )}
            >
              {subCode}
            </span>
            <div>
              <DialogTitle className="font-display text-lg">{indicatorShort}</DialogTitle>
              <DialogDescription className="line-clamp-2 text-xs">{subText}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto">
          {isAdmin && (
            <div className="border-b border-border bg-muted/30 p-4">
              {!composerOpen ? (
                <button
                  onClick={() => setComposerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" /> New post
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Google Drive share link (image or video)
                    </span>
                    <input
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Caption
                    </span>
                    <textarea
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setComposerOpen(false);
                        setNewUrl("");
                        setNewCaption("");
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button
                      onClick={addPost}
                      disabled={!newUrl.trim()}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MessageCircle className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                {isAdmin
                  ? "No posts yet — create the first one above."
                  : "No evidence has been posted yet."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={isAdmin}
                  onToggleLike={() => toggleLike(post.id, post.liked)}
                  onDelete={() => deletePost(post.id)}
                  onAddComment={(name, text) => addComment(post.id, name, text)}
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

function PostCard({
  post,
  isAdmin,
  onToggleLike,
  onDelete,
  onAddComment,
  onDeleteComment,
}: {
  post: Post;
  isAdmin: boolean;
  onToggleLike: () => void;
  onDelete: () => void;
  onAddComment: (name: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const embed = toDrivePreview(post.media_url);

  return (
    <li className="bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-muted-foreground">
          {new Date(post.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        {isAdmin && (
          <button
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="aspect-square w-full bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={`Evidence ${post.id}`}
            className="h-full w-full"
            allow="autoplay"
            allowFullScreen
          />
        ) : null}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLike}
            className={cn(
              "inline-flex items-center gap-1 text-sm transition-colors",
              post.liked ? "text-destructive" : "text-foreground hover:text-destructive",
            )}
            aria-label={post.liked ? "Unlike" : "Like"}
          >
            <Heart className={cn("h-6 w-6", post.liked && "fill-current")} />
          </button>
          <MessageCircle className="h-6 w-6 text-foreground" />
        </div>
        <p className="mt-2 text-sm font-semibold">
          {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
        </p>
        {post.caption && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {post.caption}
          </p>
        )}
      </div>

      <div className="border-t border-border px-4 py-3">
        {post.comments.length > 0 && (
          <ul className="mb-3 space-y-2">
            {post.comments.map((c) => (
              <li key={c.id} className="group flex items-start gap-2 text-sm">
                <span className="font-semibold text-foreground">{c.author}</span>
                <span className="flex-1 text-muted-foreground">{c.body}</span>
                {isAdmin && (
                  <button
                    onClick={() => onDeleteComment(c.id)}
                    className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
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
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:w-32"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 500))}
            placeholder="Add a comment…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> Post
          </button>
        </form>
      </div>
    </li>
  );
}
