// Single source of truth for which top-level keys may exist in the site
// content document. Anything else sent by a client is silently dropped.
// NOTE: "applications" intentionally lives in its own collection (see
// models/Application.js) so applicant personal data is never exposed through
// the public content endpoint.
export const CONTENT_SECTIONS = [
  "hero",
  "home",
  "about",
  "eventsPage",
  "executivePage",
  "subExecutivePage",
  "hallOfFamePage",
  "upcomingEventsPage",
  "noticePage",
  "joinPage",
  "stats",
  "testimonials",
  "galleryHighlights",
  "featuredEvents",
  "allEvents",
  "executiveMembers",
  "subExecutiveMembers",
  "hallOfFameSemesters",
  "notices",
  "upcomingEventsList",
  "collaborations",
];

export const CONTENT_SECTION_SET = new Set(CONTENT_SECTIONS);

export function isKnownSection(section) {
  return CONTENT_SECTION_SET.has(section);
}

// Keep only allowlisted keys from an incoming state object.
export function sanitizeContentState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return {};
  }

  const sanitized = {};
  for (const section of CONTENT_SECTIONS) {
    if (section in state && state[section] !== undefined) {
      sanitized[section] = state[section];
    }
  }
  return sanitized;
}
