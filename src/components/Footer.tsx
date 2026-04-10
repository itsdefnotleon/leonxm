import { Link } from "react-router-dom";
import { Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Radio className="w-4 h-4 text-primary" />
            <span>© {new Date().getFullYear()} LeonXM. All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">News</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
