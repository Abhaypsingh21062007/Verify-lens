'use client';

import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-accent-blue/10 border border-accent-blue/20 group-hover:bg-accent-blue/20 transition-colors duration-300">
              <Shield className="h-5 w-5 text-accent-blue" />
              <div className="absolute inset-0 rounded-lg bg-accent-blue/5 animate-pulse-glow" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-foreground">Verify</span>
              <span className="text-accent-blue">Lens</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/investigate"
              className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              Investigate
            </Link>
            <Link
              href={`/report/real-false-context`}
              className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              Sample Report
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/investigate"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent-blue/20 hover:bg-accent-blue/90 hover:shadow-accent-blue/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Investigation
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-card-border animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/investigate"
              className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Investigate
            </Link>
            <Link
              href={`/report/real-false-context`}
              className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sample Report
            </Link>
            <div className="pt-2">
              <Link
                href="/investigate"
                className="block text-center rounded-lg bg-accent-blue px-5 py-2.5 text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Start Investigation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
