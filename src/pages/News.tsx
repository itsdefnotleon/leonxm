import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, ChevronDown, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import defaultArticleImage from "@/assets/LeonXM_thumbnail.png.asset.json";
import { sortedArticles } from "@/lib/articles";
import { useArticleReads } from "@/hooks/use-article-reads";

export default function News() {
  const { isRead, markRead } = useArticleReads();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [autoOpened, setAutoOpened] = useState(false);

  // Auto-open the newest unread article(s) on first mount
  useEffect(() => {
    if (autoOpened) return;
    const unread = sortedArticles.filter((a) => !isRead(a.id)).map((a) => a.id);
    if (unread.length > 0) {
      setOpenIds(new Set(unread));
      // Mark them read shortly after — they're now on screen
      const timer = setTimeout(() => {
        unread.forEach(markRead);
      }, 800);
      setAutoOpened(true);
      return () => clearTimeout(timer);
    }
    setAutoOpened(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpened]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        markRead(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">News</h1>
          <p className="text-muted-foreground">The latest from LeonXM</p>
        </div>

        <div className="space-y-6">
          {sortedArticles.map((article) => {
            const isNew = !isRead(article.id);
            const isOpen = openIds.has(article.id);
            return (
              <article
                key={article.id}
                className={`border rounded-2xl overflow-hidden bg-card transition-all ${
                  isNew
                    ? "border-destructive/60 ring-2 ring-destructive/60 shadow-[0_0_30px_-5px_hsl(var(--destructive)/0.5)]"
                    : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(article.id)}
                  className="w-full text-left"
                  aria-expanded={isOpen}
                >
                  <img
                    src={article.image ?? defaultArticleImage.url}
                    alt={article.title}
                    className="w-full aspect-[1200/630] object-cover border-b border-border"
                    loading="lazy"
                  />
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        <time>{article.date}</time>
                      </div>
                      {isNew && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-bold text-foreground">{article.title}</h2>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {!isOpen && (
                      <p className="text-muted-foreground mt-3 leading-relaxed">{article.summary}</p>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-8 -mt-2">
                    <div className="prose prose-invert max-w-none">
                      {article.content.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {article.link && (
                      <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-primary text-sm">
                        <Radio className="w-4 h-4" />
                        <Link to={article.link.to} className="hover:underline font-medium">
                          {article.link.label}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
