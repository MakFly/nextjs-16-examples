import { Loader2 } from 'lucide-react';

// Loading Component
export function LoadingCard() {
  // Note: This is a client component, but we can't use translations here
  // as it's used in Suspense fallback. We'll keep it simple.
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading server data...</span>
      </div>
    </div>
  );
}
