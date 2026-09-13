'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteReportButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this investigation? This will wipe all associated data from our servers.')) {
      setIsDeleting(true);
      // Simulate API call
      setTimeout(() => {
        router.push('/');
      }, 600);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-accent-red hover:border-accent-red/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete investigation"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
