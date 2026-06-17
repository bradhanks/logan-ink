/**
 * Tests for the Sanity webhook revalidation route.
 *
 * The pure helper `parseWebhookRequest` is extracted from the route handler
 * so it can be tested without a live HTTP request. We also test the
 * `resolveInvalidation` helper that maps document types to cache tags.
 */

import { describe, it, expect, beforeAll } from "vitest";
import {
  encodeSignatureHeader,
  SIGNATURE_HEADER_NAME,
} from "@sanity/webhook";
import {
  parseWebhookRequest,
  resolveInvalidation,
  type ParsedWebhook,
} from "@/app/api/revalidate/helpers";

const SECRET = "test-secret-abc123";
const OTHER_SECRET = "wrong-secret-xyz";

async function makeSignedBody(payload: object, secret: string): Promise<{ body: string; signature: string }> {
  const body = JSON.stringify(payload);
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  return { body, signature };
}

// ---------------------------------------------------------------------------
// parseWebhookRequest — pure signature + payload extraction
// ---------------------------------------------------------------------------

describe("parseWebhookRequest", () => {
  it("rejects an invalid signature", async () => {
    const { body } = await makeSignedBody({ _type: "page" }, SECRET);
    const badSig = await encodeSignatureHeader(body, Date.now(), OTHER_SECRET);

    const result = await parseWebhookRequest(body, badSig, SECRET);
    expect(result).toEqual({ ok: false, status: 401, message: "Invalid signature" });
  });

  it("rejects a missing signature", async () => {
    const body = JSON.stringify({ _type: "page" });
    const result = await parseWebhookRequest(body, "", SECRET);
    expect(result).toEqual({ ok: false, status: 401, message: "Invalid signature" });
  });

  it("accepts a valid signature and parses the payload", async () => {
    const payload = { _type: "page", slug: { current: "about" } };
    const { body, signature } = await makeSignedBody(payload, SECRET);

    const result = await parseWebhookRequest(body, signature, SECRET);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload._type).toBe("page");
      expect(result.payload.slug?.current).toBe("about");
    }
  });

  it("accepts payload without a slug field", async () => {
    const payload = { _type: "siteSettings" };
    const { body, signature } = await makeSignedBody(payload, SECRET);

    const result = await parseWebhookRequest(body, signature, SECRET);
    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// resolveInvalidation — document type → invalidation intent
// ---------------------------------------------------------------------------

describe("resolveInvalidation", () => {
  it("maps 'page' type to page invalidation with slug", () => {
    const intent = resolveInvalidation({ _type: "page", slug: { current: "about" } });
    expect(intent).toEqual([{ type: "page", slug: "about" }]);
  });

  it("maps 'essay' type to feed invalidation", () => {
    const intent = resolveInvalidation({ _type: "essay", slug: { current: "my-essay" } });
    expect(intent).toContainEqual({ type: "feed" });
  });

  it("maps 'researchProject' type to content + feed", () => {
    const intent = resolveInvalidation({ _type: "researchProject", slug: { current: "proj-1" } });
    expect(intent.some((i) => i.type === "feed")).toBe(true);
    expect(intent.some((i) => i.type === "content")).toBe(true);
  });

  it("maps 'siteSettings' to gallery + feed + content", () => {
    const intent = resolveInvalidation({ _type: "siteSettings" });
    const types = intent.map((i) => i.type);
    expect(types).toContain("gallery");
    expect(types).toContain("feed");
    expect(types).toContain("content");
  });

  it("maps 'heroPerson' type to gallery invalidation", () => {
    const intent = resolveInvalidation({ _type: "heroPerson" });
    expect(intent.some((i) => i.type === "gallery")).toBe(true);
  });

  it("maps unknown type to content invalidation as fallback", () => {
    const intent = resolveInvalidation({ _type: "unknownType" });
    expect(intent.some((i) => i.type === "content")).toBe(true);
  });
});
