import Link from "next/link";

/**
 * Root 404 page. Statically prerendered. Restyle to match the brand.
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 px-6 text-center">
      <p className="font-mono text-sm opacity-50">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm opacity-70">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-current/20 px-5 py-2 text-sm font-medium transition-colors hover:bg-current/5"
      >
        Back home
      </Link>
    </div>
  );
}
