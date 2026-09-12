import SiteContent from "../models/SiteContent.js";
import Image from "../models/Image.js";
import Application from "../models/Application.js";

// Sync schema-declared indexes with the database. Safe to run repeatedly.
export async function ensureIndexes() {
  await Promise.all([
    SiteContent.syncIndexes(),
    Image.syncIndexes(),
    Application.syncIndexes(),
  ]);
  console.log("[db] indexes synced (sitecontents, images, applications)");
}
