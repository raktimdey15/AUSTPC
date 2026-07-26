import SiteContent from "../models/SiteContent.js";

const SINGLETON_KEY = "site-content";

export async function getOrCreateContentDocument() {
  let document = await SiteContent.findOne({ key: SINGLETON_KEY });
  if (!document) {
    document = await SiteContent.create({ key: SINGLETON_KEY, state: {} });
  }
  return document;
}

export async function updateContentDocument(updater) {
  const document = await getOrCreateContentDocument();
  const nextState = updater(document.state && typeof document.state === "object" ? document.state : {});
  document.state = nextState || {};
  await document.save();
  return document;
}