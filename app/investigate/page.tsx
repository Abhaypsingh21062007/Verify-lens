'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InvestigationForm from '@/components/investigation/InvestigationForm';
import SampleCaseSelector from '@/components/investigation/SampleCaseSelector';
import { createInvestigation } from './actions';

export default function InvestigatePage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    // Call server action
    const newId = await createInvestigation(formData);
    // Navigate to processing page
    router.push(`/investigate/${newId}/processing`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="text-center mb-10 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
              <Shield className="h-7 w-7 text-accent-blue" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              New Investigation
            </h1>
            <p className="text-muted max-w-md mx-auto">
              Upload media and describe the claim you want to verify. We&apos;ll analyse
              the content and cross-reference it against known sources.
            </p>
          </div>

          {/* Main card */}
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8 animate-fade-in-up delay-200 mb-8">
            <InvestigationForm onSubmitAction={handleSubmit} />
          </div>

          <div className="animate-fade-in-up delay-300">
            <SampleCaseSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
