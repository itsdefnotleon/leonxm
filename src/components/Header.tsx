import { Link, NavLink } from "react-router-dom";
import leonxmLogo from "@/assets/leonxm-logo.png";
import { useTimeTheme, useCurrentTime } from "@/hooks/use-time-theme";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { useNewArticleIndicator } from "@/hooks/use-new-article";

const themeIcons = { dawn: Sunrise, day: Sun, dusk: Sunset, night: Moon } as const;

const navItems = [
  { to: "/channels", label: "Channels" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
];

export function Header() {
  const theme = useTimeTheme();
  const time = useCurrentTime();
  const Icon = themeIcons[theme];
  const { isUnseen, markSeen } = useNewArticleIndicator();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={leonxmLogo} alt="LeonXM" className="h-8 object-contain transition-transform group-hover:scale-105" />
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={item.to === "/news" ? markSeen : undefined}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-foreground bg-card"
                    : "text-muted-foreground hover:text-foreground"
                } ${
                  item.to === "/news" && isUnseen
                    ? "ring-2 ring-destructive shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.5)] animate-pulse"
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="ml-4 hidden sm:flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{time}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

