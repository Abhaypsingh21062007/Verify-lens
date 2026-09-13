'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  MessageSquare, 
  QrCode,
  Send,
  ExternalLink
} from 'lucide-react';
import type { InvestigationReport } from '@/lib/types';
import { getVerdictLabel, getVerdictColor } from '@/lib/types';

interface SocialDebunkCardModalProps {
  report: InvestigationReport;
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialDebunkCardModal({ report, isOpen, onClose }: SocialDebunkCardModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const colorName = getVerdictColor(report.verdict);
  const verdictLabel = getVerdictLabel(report.verdict);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/report/${report.investigationId}` 
    : `https://verifylens.org/report/${report.investigationId}`;

  const whatsappMessage = `🚨 *VERIFYLENS FACT-CHECK ALERT* 🚨\n━━━━━━━━━━━━━━━━━━━━\n📌 *Claim:* "${report.claimMediaConsistency?.claimText || report.summary.slice(0, 100)}"\n\n⚖️ *Verdict:* ${verdictLabel.toUpperCase()}\n\n🔍 *Summary:* ${report.summary}\n\n📊 *Visual Integrity:* ${report.fileAuthenticity}% | *Claim Accuracy:* ${report.claimAccuracy}%\n🔗 *View Full Report:* ${shareUrl}\n━━━━━━━━━━━━━━━━━━━━\n_Verified by VerifyLens AI Forensic Engine_`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VerifyLens Fact-Check: ${verdictLabel}`,
          text: whatsappMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or failed', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const downloadDebunkCard = () => {
    setIsGeneratingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 1200, 630);

      // Top decorative border
      const bannerColor = colorName === 'green' ? '#10b981' : colorName === 'red' ? '#ef4444' : '#f59e0b';
      ctx.fillStyle = bannerColor;
      ctx.fillRect(0, 0, 1200, 12);

      // VerifyLens Logo & Branding
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('🛡️ VerifyLens Fact-Check Receipt', 60, 70);

      // Verdict Badge Pill
      ctx.fillStyle = bannerColor;
      ctx.beginPath();
      ctx.roundRect(60, 110, 480, 60, [12]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px sans-serif';
      ctx.fillText(verdictLabel.toUpperCase(), 85, 152);

      // Claim Section
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('CLAIM UNDER REVIEW:', 60, 220);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 24px sans-serif';
      const claimPreview = report.claimMediaConsistency?.claimText || report.summary.slice(0, 80);
      ctx.fillText(`"${claimPreview.slice(0, 75)}..."`, 60, 260);

      // AI Summary Box
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(60, 310, 1080, 170, [16]);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('VERIFIED FINDINGS:', 90, 350);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '22px sans-serif';
      
      // Simple word wrapping for summary
      const words = report.summary.split(' ');
      let line = '';
      let y = 390;
      for (let n = 0; n < words.length && y < 460; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 1000 && n > 0) {
          ctx.fillText(line, 90, y);
          line = words[n] + ' ';
          y += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 90, y);

      // Footer Metrics & ID
      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText(`ID: ${report.investigationId}  |  Authenticity: ${report.fileAuthenticity}%  |  Accuracy: ${report.claimAccuracy}%`, 60, 560);
      ctx.fillText(`Verified via VerifyLens Neural Forensics  •  ${shareUrl}`, 60, 590);

      // Download trigger
      const link = document.createElement('a');
      link.download = `verifylens-debunk-${report.investigationId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Canvas error:', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-card-border flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">One-Click Social Debunk Card</h3>
              <p className="text-xs text-muted">Share verified facts directly to WhatsApp, Twitter/X, and social chats</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Card Preview Graphic */}
          <div 
            ref={cardRef}
            className="rounded-2xl border border-card-border bg-gradient-to-br from-zinc-950 to-slate-900 p-6 space-y-4 shadow-2xl relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorName === 'green' ? 'bg-accent-green' : colorName === 'red' ? 'bg-accent-red' : 'bg-accent-amber'}`} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent-blue text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                VerifyLens Verified Receipt
              </div>
              <span className="text-[10px] font-mono text-muted">ID: {report.investigationId}</span>
            </div>

            {/* Verdict Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-black text-sm text-white shadow-md"
              style={{ background: colorName === 'green' ? '#10b981' : colorName === 'red' ? '#ef4444' : '#f59e0b' }}
            >
              {verdictLabel.toUpperCase()}
            </div>

            {/* Claim Quote */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs italic text-slate-200">
              &quot;{report.claimMediaConsistency?.claimText || report.summary.slice(0, 100)}&quot;
            </div>

            {/* Summary */}
            <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
              <p className="font-bold text-accent-blue text-[11px] mb-1">FACT SUMMARY:</p>
              <p>{report.summary}</p>
            </div>

            {/* Footer QR / Link */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-muted border-t border-white/10 font-mono">
              <span>Authenticity: {report.fileAuthenticity}%</span>
              <span>Accuracy: {report.claimAccuracy}%</span>
              <span className="text-accent-blue underline flex items-center gap-1">
                verifylens.org <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* WhatsApp Text Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted flex items-center justify-between">
              <span>WhatsApp / Telegram Ready Reply Message</span>
              <span className="text-accent-green font-normal text-[11px]">Formatted with bold emojis</span>
            </label>
            <div className="p-3.5 rounded-xl bg-background border border-card-border font-mono text-xs text-foreground/90 whitespace-pre-line select-all leading-relaxed">
              {whatsappMessage}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-5 border-t border-card-border bg-background/50 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-card-border text-sm font-semibold text-foreground hover:bg-white/5 transition-all"
          >
            {copiedText ? (
              <>
                <Check className="h-4 w-4 text-accent-green" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy WhatsApp Text
              </>
            )}
          </button>

          <button
            type="button"
            onClick={downloadDebunkCard}
            disabled={isGeneratingPng}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-bold shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPng ? 'Generating PNG...' : 'Download Card (PNG)'}
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-green text-white text-sm font-bold shadow-md hover:bg-emerald-600 transition-all"
            >
              <Send className="h-4 w-4" />
              Share Direct
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
