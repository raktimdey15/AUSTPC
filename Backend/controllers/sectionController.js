import { getOrCreateContentDocument, updateContentDocument } from "../services/contentService.js";

const SECTION_ALLOWLIST = new Set([
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
  "applications",
]);

export async function getSection(req, res) {
  try {
    const { section } = req.params;
    if (!SECTION_ALLOWLIST.has(section)) {
      return res.status(404).json({ message: "Unknown section" });
    }

    const document = await getOrCreateContentDocument();
    return res.json({ section, value: document.state?.[section] ?? null });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load section", error: error.message });
  }
}

export async function updateSection(req, res) {
  try {
    const { section } = req.params;
    if (!SECTION_ALLOWLIST.has(section)) {
      return res.status(404).json({ message: "Unknown section" });
    }

    const value = req.body?.value;
    const document = await updateContentDocument((currentState) => ({
      ...currentState,
      [section]: value,
    }));

    return res.json({ section, value: document.state?.[section] ?? null });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update section", error: error.message });
  }
}

export async function getContentSnapshot(_req, res) {
  try {
    const document = await getOrCreateContentDocument();
    return res.json({ state: document.state || {}, updatedAt: document.updatedAt || null });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load content snapshot", error: error.message });
  }
}