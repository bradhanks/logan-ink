/**
 * Root route-level loading UI. Shown instantly while a dynamic segment streams
 * in (Suspense fallback for the whole route). Intentionally minimal — restyle
 * to match the brand. Keeping it lightweight matters for perceived performance.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex flex-1 items-center justify-center py-32"
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
    </div>
  );
}
