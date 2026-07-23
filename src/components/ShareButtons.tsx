import { useState } from "react";
import { Check, Facebook, Link2, Linkedin, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

type ShareButtonsProps = {
  url: string;
  title: string;
  compact?: boolean;
};

export function ShareButtons({ url, title, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : "mt-2"}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mr-1">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
        >
          <l.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-primary" /> : <Link2 className="w-4 h-4" />}
      </button>
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors sm:hidden"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
