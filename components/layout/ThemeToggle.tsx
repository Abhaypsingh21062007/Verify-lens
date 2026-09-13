'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full border border-card-border bg-card/50" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-card/50 text-muted hover:bg-card hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[18px] w-[18px] transition-all" />
      ) : (
        <Moon className="h-[18px] w-[18px] transition-all" />
      )}
    </button>
  );
}
