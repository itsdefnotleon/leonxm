import { Radio } from "lucide-react";
import { Link } from "react-router-dom";
import leonxmLogo from "@/assets/leonxm-logo.png";

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={leonxmLogo} alt="LeonXM" className="h-8 object-contain" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Channels</Link>
          <Link to="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">News</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            <Radio className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Free to Listen</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
