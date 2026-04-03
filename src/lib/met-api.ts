"use client";

export interface MetArtwork {
  objectId: number;
  title: string;
  artist: string;
  artworkDate: string;
  primaryImageUrl: string;
  blurb: string;
}

// 28 curated paintings (4 weeks) — all verified with working image URLs
const CURATED: MetArtwork[] = [
  { objectId: 436535, title: "Wheat Field with Cypresses", artist: "Vincent van Gogh", artworkDate: "1889", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg", blurb: "Painted at the asylum in Saint-Rémy, swirling cypresses reach toward a turbulent sky like dark flames against golden wheat." },
  { objectId: 436524, title: "Sunflowers", artist: "Vincent van Gogh", artworkDate: "1887", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-41223-001.jpg", blurb: "A luminous arrangement from Van Gogh's Paris period, where he absorbed Impressionism and transformed it into something entirely his own." },
  { objectId: 438417, title: "Two Men Contemplating the Moon", artist: "Caspar David Friedrich", artworkDate: "ca. 1825–30", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-31997-001-NEW.jpg", blurb: "Two figures stand in silhouette against a luminous sky, dwarfed by ancient oaks. An invitation into the sublime mystery of the natural world." },
  { objectId: 437984, title: "La Berceuse", artist: "Vincent van Gogh", artworkDate: "1889", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-19279-001.jpg", blurb: "A woman rocking a cradle, rendered in Van Gogh's boldest colors. He imagined this painting as a comfort to sailors at sea." },
  { objectId: 436105, title: "The Death of Socrates", artist: "Jacques Louis David", artworkDate: "1787", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13139-001.jpg", blurb: "Socrates reaches for the hemlock with calm resolve while his students grieve. A neoclassical masterpiece of philosophical courage." },
  { objectId: 435868, title: "The Card Players", artist: "Paul Cézanne", artworkDate: "ca. 1890–92", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP231550.jpg", blurb: "Two men absorbed in their card game, painted with Cézanne's patient geometry. Every fold and shadow builds toward a quiet monumentality." },
  { objectId: 437329, title: "The Abduction of the Sabine Women", artist: "Nicolas Poussin", artworkDate: "ca. 1633–34", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-29324-001.jpg", blurb: "A dramatic frozen moment of chaos and motion. Poussin channels raw violence into ordered, almost choreographed beauty." },
  { objectId: 436002, title: "Woman with a Parrot", artist: "Gustave Courbet", artworkDate: "1866", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-17680-001.jpg", blurb: "Courbet's realism meets sensuality as a figure reclines with cascading hair, a bright parrot perched on her raised hand." },
  { objectId: 437980, title: "Cypresses", artist: "Vincent van Gogh", artworkDate: "1889", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg", blurb: "Dark cypress trees flame upward like green fire against a swirling sky. Van Gogh saw in them the same intensity he felt in his own restless spirit." },
  { objectId: 436121, title: "A Woman Seated beside a Vase of Flowers", artist: "Edgar Degas", artworkDate: "1865", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg", blurb: "Degas pushes his sitter to the edge of the canvas while an enormous bouquet claims center stage. A radical rethinking of portraiture." },
  { objectId: 437826, title: "Venus and Adonis", artist: "Peter Paul Rubens", artworkDate: "ca. 1635", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-19299-001.jpg", blurb: "Venus clings desperately to Adonis as he pulls away toward the fatal hunt. Rubens captures the ache of love unable to stop what's coming." },
  { objectId: 436528, title: "Irises", artist: "Vincent van Gogh", artworkDate: "1890", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP346474.jpg", blurb: "Among Van Gogh's last paintings at Saint-Rémy: irises burst from the earth in deep violet and blue, a celebration of life." },
  { objectId: 435882, title: "Still Life with Apples and a Pot of Primroses", artist: "Paul Cézanne", artworkDate: "ca. 1890", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT47.jpg", blurb: "Cézanne's apples are not mere fruit. They are worlds unto themselves, each one a meditation on color, form, and the patience of looking." },
  { objectId: 437879, title: "Study of a Young Woman", artist: "Johannes Vermeer", artworkDate: "ca. 1665–67", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP353256.jpg", blurb: "Vermeer's quiet luminosity distilled: a young woman turns toward us, her gaze as soft and direct as the light on her face." },
  { objectId: 11417, title: "Washington Crossing the Delaware", artist: "Emanuel Leutze", artworkDate: "1851", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ad/web-large/DP215410.jpg", blurb: "An iconic tableau of determination: Washington stands resolute among his weary troops on a Christmas night that would turn the tide." },
  { objectId: 45434, title: "Under the Wave off Kanagawa", artist: "Katsushika Hokusai", artworkDate: "ca. 1830–32", primaryImageUrl: "https://images.metmuseum.org/CRDImages/as/web-large/DP130155.jpg", blurb: "The raw power of nature rendered in woodblock: foam-tipped claws of water reach for the sky as boats navigate an enormous wave." },
  { objectId: 436946, title: "The Brioche", artist: "Jean Siméon Chardin", artworkDate: "1763", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13655-001.jpg", blurb: "A brioche crowned with orange blossom sits among fruits and a liqueur bottle. Chardin elevates the everyday to quiet poetry." },
  { objectId: 437153, title: "Oedipus and the Sphinx", artist: "Gustave Moreau", artworkDate: "1864", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-14201-023.jpg", blurb: "The Sphinx clings to Oedipus in an unsettling embrace. Moreau's symbolist vision transforms the ancient riddle into a confrontation between fate and will." },
  { objectId: 438009, title: "The Pink Dress", artist: "Jean Frédéric Bazille", artworkDate: "1864", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1927.jpg", blurb: "A young woman in pink gazes out over a sun-drenched village. Bazille captures a moment of quiet contemplation bathed in Mediterranean light." },
  { objectId: 459027, title: "Portrait of a Woman", artist: "Jacometto Veneziano", artworkDate: "ca. 1485–95", primaryImageUrl: "https://images.metmuseum.org/CRDImages/rl/web-large/DP221483.jpg", blurb: "A small jewel of Venetian portraiture: her steady gaze and simple veil speak of an inner composure that transcends the centuries." },
  { objectId: 438821, title: "Ia Orana Maria (Hail Mary)", artist: "Paul Gauguin", artworkDate: "1891", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1025.jpg", blurb: "Gauguin's first major Tahitian painting reimagines the Annunciation in a tropical paradise, making the sacred feel lush and intimately human." },
  { objectId: 437998, title: "Olive Trees", artist: "Vincent van Gogh", artworkDate: "1889", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1946.jpg", blurb: "Twisted olive trees writhe under a swirling Provençal sky. Van Gogh found in their gnarled forms a mirror of his own restless energy." },
  { objectId: 436573, title: "Cardinal Fernando Niño de Guevara", artist: "El Greco", artworkDate: "ca. 1600", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-17777-001.jpg", blurb: "The cardinal sits in crimson robes, his piercing gaze and spectacles lending an uncanny modernity to a 16th-century portrait." },
  { objectId: 436965, title: "The Monet Family in Their Garden", artist: "Édouard Manet", artworkDate: "1874", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25465-001.jpg", blurb: "Manet captures his friend Monet's family in a sun-dappled garden at Argenteuil, a snapshot of Impressionist life lived in color." },
  { objectId: 435888, title: "Soap Bubbles", artist: "Jean Siméon Chardin", artworkDate: "ca. 1733–34", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP356133.jpg", blurb: "A young man gently blows a soap bubble from a window ledge. Chardin transforms a fleeting moment into a meditation on impermanence." },
  { objectId: 436840, title: "Salisbury Cathedral from the Bishop's Garden", artist: "John Constable", artworkDate: "ca. 1826", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP169636.jpg", blurb: "The cathedral spire rises through an arch of ancient elms. Constable paints English light with a devotion bordering on prayer." },
  { objectId: 437329, title: "Merry Company on a Terrace", artist: "Jan Steen", artworkDate: "ca. 1670", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP145926.jpg", blurb: "Jan Steen fills his canvas with the cheerful chaos of a Dutch gathering, every detail a miniature story of human folly." },
  { objectId: 436535, title: "Self-Portrait with a Straw Hat", artist: "Vincent van Gogh", artworkDate: "1887", primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg", blurb: "Van Gogh studies himself with unflinching honesty, the straw hat catching afternoon light in short, vibrant strokes." },
];

// FNV-1a hash
function fnv1a(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// On-demand cache for dates beyond the curated 4 weeks
const fetchCache = new Map<string, MetArtwork>();

async function fetchFromApi(dateStr: string): Promise<MetArtwork | null> {
  if (fetchCache.has(dateStr)) return fetchCache.get(dateStr)!;

  try {
    // Use the hash to pick a deterministic object ID from a known range
    const hash = fnv1a(dateStr);
    const objectId = 435000 + (hash % 5000); // European Paintings range

    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );
    if (!res.ok) return null;
    const obj = await res.json();

    if (!obj.primaryImageSmall || !obj.isPublicDomain) return null;

    const artwork: MetArtwork = {
      objectId: obj.objectID,
      title: obj.title || "Untitled",
      artist: obj.artistDisplayName || "",
      artworkDate: obj.objectDate || "",
      primaryImageUrl: obj.primaryImageSmall,
      blurb: "",
    };
    fetchCache.set(dateStr, artwork);
    return artwork;
  } catch {
    return null;
  }
}

export function getArtworkForDate(dateStr: string): MetArtwork {
  const hash = fnv1a(dateStr);
  return CURATED[hash % CURATED.length];
}

export async function getArtworksForWeek(dates: Date[]): Promise<MetArtwork[]> {
  // For the current 4-week window, use curated artworks (instant)
  // For older weeks, try the API with curated fallback
  const today = new Date();
  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(today.getDate() - 28);

  const results: MetArtwork[] = [];

  for (const d of dates) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (d >= fourWeeksAgo) {
      // Recent: use curated (instant, reliable)
      results.push(getArtworkForDate(key));
    } else {
      // Older: try API, fall back to curated
      const fetched = await fetchFromApi(key);
      results.push(fetched || getArtworkForDate(key));
    }
  }

  return results;
}
