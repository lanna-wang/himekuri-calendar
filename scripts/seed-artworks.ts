import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Classifications to skip entirely
const SKIP_CLASSIFICATIONS = new Set([
  "Furniture", "Vessels", "Jewelry", "Tools", "Arms", "Armor",
  "Metalwork", "Glass", "Ivories", "Enamels", "Coins", "Medals",
]);

function makeBlurb(obj: any): string {
  const medium = obj.medium ? obj.medium.split(";")[0].trim() : "";
  const culture = obj.culture || "";
  const period = obj.period || "";
  const context = culture || period;
  if (medium && context) return `${medium}. ${context}.`;
  if (medium) return medium + ".";
  if (context) return context + ".";
  return "";
}

async function main() {
  console.log("🎨 Seeding 365 artworks for 2026...\n");

  // Fetch a large pool of public domain objects with images
  console.log("Fetching public domain object IDs with images...");
  const data = await fetchJSON(
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q=*"
  );

  if (!data.objectIDs || data.objectIDs.length === 0) {
    console.error("No objects found!");
    return;
  }

  console.log(`Found ${data.objectIDs.length} public domain objects with images.`);

  // Shuffle all IDs
  const shuffled: number[] = data.objectIDs.sort(() => Math.random() - 0.5);

  // Fetch details until we have 365
  const artworks: {
    date: string;
    oid: number;
    title: string;
    artist: string | null;
    adate: string | null;
    img: string;
    blurb: string | null;
  }[] = [];

  const startDate = new Date("2026-01-01");
  let dayIndex = 0;

  for (let i = 0; i < shuffled.length && dayIndex < 365; i++) {
    try {
      const obj = await fetchJSON(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${shuffled[i]}`
      );

      // Must have an image
      if (!obj.primaryImageSmall) continue;

      // Skip bad classifications
      if (obj.classification && SKIP_CLASSIFICATIONS.has(obj.classification)) continue;

      // Skip untitled or very short titles
      if (!obj.title || obj.title.length < 3) continue;

      const d = new Date(startDate);
      d.setDate(startDate.getDate() + dayIndex);
      const dateStr = d.toISOString().split("T")[0];

      artworks.push({
        date: dateStr,
        oid: obj.objectID,
        title: obj.title.slice(0, 200),
        artist: (obj.artistDisplayName || null)?.slice(0, 100) || null,
        adate: (obj.objectDate || null)?.slice(0, 50) || null,
        img: obj.primaryImageSmall,
        blurb: makeBlurb(obj) || null,
      });

      dayIndex++;

      if (dayIndex % 25 === 0) {
        console.log(`  seeding day ${dayIndex}/365... (checked ${i + 1} objects)`);
      }
    } catch {
      // Skip failed fetches
    }

    await sleep(60);
  }

  console.log(`\nFetched ${artworks.length} artworks.`);

  if (artworks.length < 365) {
    console.warn(`⚠️  Only got ${artworks.length}/365.`);
  }

  // Clear existing and insert
  console.log("\nClearing existing artworks...");
  await supabase.from("artworks").delete().neq("date", "1900-01-01");

  console.log("Inserting into Supabase...");
  const batchSize = 50;
  for (let i = 0; i < artworks.length; i += batchSize) {
    const batch = artworks.slice(i, i + batchSize);
    const { error } = await supabase.from("artworks").insert(batch);

    if (error) {
      console.error(`  Batch error at ${i}: ${error.message}`);
    } else {
      console.log(`  Inserted ${Math.min(i + batchSize, artworks.length)}/${artworks.length}`);
    }
  }

  console.log("\n✅ Done seeding artworks!");
}

main().catch(console.error);
