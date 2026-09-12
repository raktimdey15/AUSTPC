/**
 * Seed the database with the canonical default site content and sync indexes.
 *
 * Usage:
 *   npm run seed          # only writes content if the document is empty
 *   npm run seed:force    # overwrites existing content with the defaults
 */
import "../config/loadEnv.js";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { cloneDefaultSiteContent } from "../config/defaultContent.js";
import { ensureIndexes } from "./ensureIndexes.js";
import SiteContent from "../models/SiteContent.js";
import Application from "../models/Application.js";
import Image from "../models/Image.js";

const FORCE = process.argv.includes("--force");
const SINGLETON_KEY = "site-content";

async function seed() {
  await connectDB();
  await ensureIndexes();

  let document = await SiteContent.findOne({ key: SINGLETON_KEY });
  const hasContent = document && document.state && Object.keys(document.state).length > 0;

  if (!document) {
    document = await SiteContent.create({ key: SINGLETON_KEY, state: cloneDefaultSiteContent() });
    console.log("[seed] created site content document with default content");
  } else if (!hasContent || FORCE) {
    document.state = cloneDefaultSiteContent();
    document.markModified("state");
    await document.save();
    console.log(`[seed] ${FORCE ? "overwrote" : "filled"} site content with default content`);
  } else {
    console.log("[seed] site content already present — skipped (use --force to overwrite)");
  }

  const [applicationCount, imageCount] = await Promise.all([
    Application.countDocuments(),
    Image.countDocuments(),
  ]);

  const sections = Object.keys(document.state || {});
  console.log("[seed] database summary");
  console.log(`  • database:      ${mongoose.connection.name}`);
  console.log(`  • content keys:  ${sections.length} sections (${sections.slice(0, 6).join(", ")}, ...)`);
  console.log(`  • applications:  ${applicationCount}`);
  console.log(`  • images:        ${imageCount}`);
}

seed()
  .then(async () => {
    await disconnectDB();
    console.log("[seed] done");
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("[seed] failed:", error);
    await disconnectDB().catch(() => {});
    process.exit(1);
  });
