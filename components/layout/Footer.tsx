import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                <Shield className="h-4 w-4 text-accent-blue" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-foreground">Verify</span>
                <span className="text-accent-blue">Lens</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Context-aware media investigation. Detect manipulation, trace provenance, and verify the story behind the media.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/investigate" className="text-sm text-muted hover:text-foreground transition-colors">
                  Start Investigation
                </Link>
              </li>
              <li>
                <Link href={`/report/real-false-context`} className="text-sm text-muted hover:text-foreground transition-colors">
                  Sample Report
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              VerifyLens is an advanced media-investigation tool powered by Google Gemini. It uses live multimodal AI to detect manipulation, trace provenance, and verify the context of images and videos.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} VerifyLens. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built for truth in the age of synthetic media.
          </p>
        </div>
      </div>
    </footer>
  );
}
