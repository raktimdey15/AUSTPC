import { getPublicContentState, replaceContentState } from "../services/contentService.js";
import { createApplication } from "./applicationController.js";

export async function getSiteContent(_req, res, next) {
  try {
    const { state } = await getPublicContentState();
    return res.json(state);
  } catch (error) {
    return next(error);
  }
}

export async function saveSiteContent(req, res, next) {
  try {
    const incomingState = req.body?.state ?? req.body;
    const document = await replaceContentState(incomingState);
    return res.json({ message: "Content saved", state: document.state });
  } catch (error) {
    return next(error);
  }
}

// Legacy alias kept for the existing frontend (`POST /api/content/applications`).
// Applications are stored in their own collection, never in the content blob.
export const submitApplication = createApplication;
