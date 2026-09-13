'use client';

import type { ProvenanceData, ProvenanceStatus } from '@/lib/types';
import {
  FileCode2,
  FileCheck2,
  Hash,
  Database,
  Calendar,
  Layers,
  ImagePlus,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// ── Badge & Icon Helpers ────────────────────────────────────

function getStatusInfo(status: ProvenanceStatus) {
  switch (status) {
    case 'Verified provenance':
      return { icon: CheckCircle2, bg: 'bg-accent-green/10', text: 'text-accent-green', border: 'border-accent-green/30' };
    case 'Partial provenance':
      return { icon: Info, bg: 'bg-accent-amber/10', text: 'text-accent-amber', border: 'border-accent-amber/30' };
    case 'No provenance found':
      return { icon: ShieldAlert, bg: 'bg-accent-red/10', text: 'text-accent-red', border: 'border-accent-red/30' };
    case 'Conflicting provenance':
      return { icon: AlertCircle, bg: 'bg-accent-red/10', text: 'text-accent-red', border: 'border-accent-red/30' };
    case 'Invalid provenance':
      return { icon: AlertCircle, bg: 'bg-accent-red/10', text: 'text-accent-red', border: 'border-accent-red/30' };
    default:
      return { icon: Info, bg: 'bg-card', text: 'text-muted', border: 'border-card-border' };
  }
}

// ── Shared Row Component ────────────────────────────────────

function MetadataRow({ 
  icon: Icon, 
  label, 
  value, 
  isMonospace = false,
  tooltip
}: { 
  icon: typeof Info, 
  label: string, 
  value: string, 
  isMonospace?: boolean,
  tooltip?: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-card-border/50 last:border-0 gap-1 sm:gap-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted shrink-0" />
        {tooltip ? (
          <abbr title={tooltip} className="text-sm font-medium text-foreground/80 no-underline cursor-help">
            {label}
          </abbr>
        ) : (
          <span className="text-sm font-medium text-foreground/80">{label}</span>
        )}
      </div>
      <span className={`text-sm text-foreground break-all ${isMonospace ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────

interface ProvenancePassportProps {
  data?: ProvenanceData;
  isShared?: boolean;
}

export default function ProvenancePassport({ data, isShared = false }: ProvenancePassportProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No provenance data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          Provenance analysis will populate once the investigation engine processes the file.
        </p>
      </div>
    );
  }

  const c2paStyle = getStatusInfo(data.c2paStatus);
  const C2paIcon = c2paStyle.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileCode2 className="h-5 w-5 text-accent-blue" />
        <h3 className="text-lg font-bold text-foreground">Provenance Passport</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Overview & C2PA */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Main Status Card */}
          <div className={`rounded-xl border p-5 ${c2paStyle.bg} ${c2paStyle.border} flex flex-col items-center justify-center text-center space-y-3`}>
            <C2paIcon className={`h-8 w-8 ${c2paStyle.text}`} />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1 text-foreground">
                <abbr title="Coalition for Content Provenance and Authenticity - an open standard for digital content provenance." className="no-underline cursor-help">
                  Content Credentials
                </abbr>
              </p>
              <h4 className={`text-lg font-bold ${c2paStyle.text}`}>{data.c2paStatus}</h4>
            </div>
          </div>

          {/* Core File Details */}
          <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted mb-3">File Properties</h4>
            <div className="flex justify-between items-center py-2 border-b border-card-border/50">
              <span className="text-sm text-foreground/80">File Type</span>
              <span className="text-sm font-semibold text-foreground">{data.fileType}</span>
            </div>
            {!isShared && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-foreground/80">File Size</span>
                <span className="text-sm font-semibold text-foreground">{data.fileSize}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Detailed Metadata Table */}
        <div className="lg:col-span-2 space-y-4">
          {!isShared && (
            <div className="rounded-xl border border-card-border bg-card p-5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">Cryptographic & Visual Hashes</h4>
              
              <MetadataRow icon={Hash} label="SHA-256 Hash" value={data.sha256} isMonospace tooltip="A cryptographic fingerprint of the file data." />
              <MetadataRow icon={Layers} label="Perceptual Hash" value={data.perceptualHash} isMonospace tooltip="Used to find visually similar images across the web." />
            </div>
          )}

          <div className="rounded-xl border border-card-border bg-card p-5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">Historical Metadata</h4>
            
            {!isShared && (
              <>
                <MetadataRow icon={Calendar} label="Creation Metadata" value={data.creationMetadata} />
                <MetadataRow icon={Database} label="Modification Metadata" value={data.modificationMetadata} />
                <MetadataRow icon={ImagePlus} label="Editing Software" value={data.editingSoftware} />
              </>
            )}
            <MetadataRow icon={Calendar} label="First Observed Online" value={data.firstObservedOnline} />
            <MetadataRow icon={FileCheck2} label="Transformations Detected" value={data.transformationsDetected} />
          </div>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="rounded-xl border border-accent-blue/20 bg-accent-blue-dim p-4 flex items-start gap-3 mt-4">
        <Info className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90 leading-relaxed">
          Missing provenance does not prove that media is fake. Provenance describes file history, not whether the attached story is true.
        </p>
      </div>

    </div>
  );
}
