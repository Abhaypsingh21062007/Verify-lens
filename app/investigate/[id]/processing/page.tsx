import { getInvestigation } from '@/lib/repository';
import ProcessingClient from '@/components/investigation/ProcessingClient';
import { redirect } from 'next/navigation';

interface ProcessingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProcessingPage({ params }: ProcessingPageProps) {
  const { id } = await params;

  // Retrieve the in-memory investigation
  const investigation = getInvestigation(id);

  if (!investigation) {
    // If not found (e.g. server restart), just redirect to a mock sample report
    redirect('/report/sample-001');
  }

  // Extract necessary details for the UI
  const claimText = investigation.claims[0]?.content || "No claim provided";
  const mediaUrl = investigation.assets[0]?.url || "No media uploaded";
  const mode = (investigation.assets[0]?.metadata?.mode as string) || "quick";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      
      <div className="relative z-10 w-full h-full">
        <ProcessingClient 
          investigationId={id} 
          claimText={claimText} 
          mediaUrl={mediaUrl}
          mode={mode}
        />
      </div>
    </div>
  );
}
