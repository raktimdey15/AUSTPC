import { getOrCreateContentDocument, getPublicContentState, updateContentDocument } from "../services/contentService.js";
import { isKnownSection } from "../config/contentSections.js";

export async function getSection(req, res, next) {
  try {
    const { section } = req.params;
    if (!isKnownSection(section)) {
      return res.status(404).json({ message: "Unknown section" });
    }

    const document = await getOrCreateContentDocument();
    return res.json({ section, value: document.state?.[section] ?? null });
  } catch (error) {
    return next(error);
  }
}

export async function updateSection(req, res, next) {
  try {
    const { section } = req.params;
    if (!isKnownSection(section)) {
      return res.status(404).json({ message: "Unknown section" });
    }

    const value = req.body?.value;
    const document = await updateContentDocument((currentState) => ({
      ...currentState,
      [section]: value,
    }));

    return res.json({ section, value: document.state?.[section] ?? null });
  } catch (error) {
    return next(error);
  }
}

export async function getContentSnapshot(_req, res, next) {
  try {
    const snapshot = await getPublicContentState();
    return res.json(snapshot);
  } catch (error) {
    return next(error);
  }
}
