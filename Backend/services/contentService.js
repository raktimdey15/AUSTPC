import SiteContent from "../models/SiteContent.js";
import { sanitizeContentState } from "../config/contentSections.js";
import { cloneDefaultSiteContent } from "../config/defaultContent.js";

const SINGLETON_KEY = "site-content";

export async function getOrCreateContentDocument() {
  let document = await SiteContent.findOne({ key: SINGLETON_KEY });
  if (!document) {
    // First boot on an empty database: seed with the canonical defaults so the
    // site never renders empty. `scripts/seed.js` does the same thing ahead of
    // time; this is the safety net.
    document = await SiteContent.create({ key: SINGLETON_KEY, state: cloneDefaultSiteContent() });
  }
  return document;
}

export async function replaceContentState(incomingState) {
  const document = await getOrCreateContentDocument();
  document.state = sanitizeContentState(incomingState);
  document.markModified("state");
  await document.save();
  return document;
}

export async function updateContentDocument(updater) {
  const document = await getOrCreateContentDocument();
  const currentState = document.state && typeof document.state === "object" ? document.state : {};
  document.state = sanitizeContentState(updater(currentState));
  document.markModified("state");
  await document.save();
  return document;
}

// Public read: never leak anything outside the allowlist (protects against
// legacy documents that stored applications inside the content blob).
export async function getPublicContentState() {
  const document = await getOrCreateContentDocument();
  return {
    state: sanitizeContentState(document.state),
    updatedAt: document.updatedAt || null,
  };
}
