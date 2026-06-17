/**
 * Server instrumentation hooks (Next.js).
 *
 * `register` runs once when the server boots — the place to initialize tracing,
 * metrics, or an error reporter. `onRequestError` fires for every uncaught
 * server-side render/route error and is the natural integration point for
 * Sentry / PostHog error tracking.
 */

export async function register() {
  // TODO(observability): init OpenTelemetry / Sentry / PostHog here.
  // Kept empty so it's a zero-cost no-op until a provider is chosen.
}

export const onRequestError: import("next").Instrumentation.onRequestError =
  async (err, request, context) => {
    // TODO(observability): forward to your error sink. Logging for now.
    console.error("[request-error]", context.routePath ?? request.path, err);
  };
