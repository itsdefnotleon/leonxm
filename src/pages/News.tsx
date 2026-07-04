import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import defaultArticleImage from "@/assets/leonxm-default-article.webp.asset.json";
import { sortedArticles } from "@/lib/articles";
import { useNewArticleIndicator } from "@/hooks/use-new-article";

export default function News() {
  const { isUnseen } = useNewArticleIndicator();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">News</h1>
          <p className="text-muted-foreground">The latest from LeonXM</p>
        </div>

        <div className="space-y-10">
          {sortedArticles.map((article, index) => {
            const isNew = isUnseen && index === 0;
            return (
              <article
                key={article.id}
                className={`border border-border rounded-2xl overflow-hidden bg-card transition-shadow ${
                  isNew
                    ? "ring-2 ring-destructive shadow-[0_0_30px_-5px_hsl(var(--destructive)/0.5)] animate-pulse"
                    : ""
                }`}
              >
                <img
                  src={article.image ?? defaultArticleImage.url}
                  alt={article.title}
                  className="w-full aspect-[1200/630] object-cover border-b border-border"
                  loading="lazy"
                />
                <div className="p-8">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <time>{article.date}</time>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{article.title}</h2>
                  <div className="prose prose-invert max-w-none">
                    {article.content.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  {article.link && (
                    <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-primary text-sm">
                      <Radio className="w-4 h-4" />
                      <Link to={article.link.to} className="hover:underline font-medium">{article.link.label}</Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
