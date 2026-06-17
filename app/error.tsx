"use client";

/**
 * Route-level error boundary. Catches render/data errors within a segment and
 * offers a recovery path without a full reload. Restyle to match the brand.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm opacity-70">
        An unexpected error occurred. You can try again, and if it keeps
        happening, come back a little later.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs opacity-40">ref: {error.digest}</p>
      ) : null}
      <button
        onClick={reset}
        className="mt-2 rounded-full border border-current/20 px-5 py-2 text-sm font-medium transition-colors hover:bg-current/5"
      >
        Try again
      </button>
    </div>
  );
}
