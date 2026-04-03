/**
 * Fetches 365 unique artworks from the Met Museum API and saves them
 * as a static JSON file. Run once, commit the output.
 *
 * Usage: npx tsx scripts/build-artworks.ts
 */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

interface Artwork {
  id: number;
  title: string;
  artist: string;
  date: string;
  img: string;
  blurb: string;
}

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
  console.log("🎨 Fetching 365 unique artworks from the Met Museum...\n");

  // Fetch from multiple painting-heavy departments
  const deptIds = [11, 21, 9, 26]; // European Paintings, Modern Art, Drawings/Prints, Asian Art
  const allIds: number[] = [];

  for (const deptId of deptIds) {
    console.log(`Fetching department ${deptId}...`);
    try {
      const data = await fetchJSON(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&departmentId=${deptId}&q=*`
      );
      if (data.objectIDs) {
        allIds.push(...data.objectIDs);
        console.log(`  Got ${data.objectIDs.length} IDs`);
      }
    } catch (e) {
      console.error(`  Failed: ${e}`);
    }
    await sleep(500);
  }

  // Deduplicate and shuffle
  const uniqueIds = [...new Set(allIds)].sort(() => Math.random() - 0.5);
  console.log(`\nTotal pool: ${uniqueIds.length} unique IDs`);

  const artworks: Artwork[] = [];

  for (let i = 0; i < uniqueIds.length && artworks.length < 365; i++) {
    try {
      const obj = await fetchJSON(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${uniqueIds[i]}`
      );

      if (!obj.primaryImageSmall || !obj.isPublicDomain) continue;
      if (!obj.title || obj.title.length < 3) continue;

      // Verify image actually loads
      const imgRes = await fetch(obj.primaryImageSmall, { method: "HEAD" });
      if (!imgRes.ok) continue;

      artworks.push({
        id: obj.objectID,
        title: obj.title.slice(0, 200),
        artist: (obj.artistDisplayName || "").slice(0, 100),
        date: (obj.objectDate || "").slice(0, 50),
        img: obj.primaryImageSmall,
        blurb: makeBlurb(obj),
      });

      if (artworks.length % 25 === 0) {
        console.log(`  ✓ ${artworks.length}/365 (checked ${i + 1} objects)`);
      }
    } catch {
      // skip
    }
    await sleep(250);
  }

  console.log(`\n✅ Got ${artworks.length} verified artworks.`);

  // Write to public/data/artworks.json
  const fs = await import("fs");
  const path = await import("path");
  const outDir = path.resolve(__dirname, "../public/data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "artworks.json");
  fs.writeFileSync(outPath, JSON.stringify(artworks));

  console.log(`Saved to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
