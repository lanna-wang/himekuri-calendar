export interface Artwork {
  id: string;
  date: string; // YYYY-MM-DD
  objectId: number;
  title: string;
  artist: string;
  artworkDate: string;
  primaryImageUrl: string;
  blurb: string;
}

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  accomplished: string;
  happy: string;
  lookingForward: string;
  artworkId: string;
  starImage: string; // path to star image
  createdAt: string;
}

const STAR_IMAGES = [
  "/images/star-yellow.png",
  "/images/star-pink.png",
  "/images/star-purple.png",
  "/images/star-blue.png",
  "/images/star-green.png",
];

export function getRandomStarImage(): string {
  return STAR_IMAGES[Math.floor(Math.random() * STAR_IMAGES.length)];
}

// Real Met Museum public domain artworks — URLs verified against the API
const ARTWORKS_POOL: Omit<Artwork, "id" | "date">[] = [
  {
    objectId: 436535,
    title: "Wheat Field with Cypresses",
    artist: "Vincent van Gogh",
    artworkDate: "1889",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg",
    blurb: "Painted during Van Gogh's time at the asylum in Saint-Rémy, the swirling cypresses reach toward a turbulent sky like dark flames against golden wheat.",
  },
  {
    objectId: 436524,
    title: "Sunflowers",
    artist: "Vincent van Gogh",
    artworkDate: "1887",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-41223-001.jpg",
    blurb: "A luminous arrangement of sunflowers from Van Gogh's Paris period, where he absorbed the lessons of Impressionism and transformed them into something entirely his own.",
  },
  {
    objectId: 438417,
    title: "Two Men Contemplating the Moon",
    artist: "Caspar David Friedrich",
    artworkDate: "ca. 1825–30",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-31997-001-NEW.jpg",
    blurb: "Two figures stand in silhouette against a luminous sky, dwarfed by ancient oaks. Friedrich invites us into a meditation on the sublime mystery of the natural world.",
  },
  {
    objectId: 437984,
    title: "La Berceuse",
    artist: "Vincent van Gogh",
    artworkDate: "1889",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-19279-001.jpg",
    blurb: "A woman rocking a cradle, rendered in Van Gogh's boldest colors. He imagined this painting as a comfort to sailors at sea, a lullaby in paint.",
  },
  {
    objectId: 436105,
    title: "The Death of Socrates",
    artist: "Jacques Louis David",
    artworkDate: "1787",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13139-001.jpg",
    blurb: "Socrates reaches for the hemlock with calm resolve while his students grieve. David's neoclassical masterpiece captures philosophical courage in the face of death.",
  },
  {
    objectId: 435868,
    title: "The Card Players",
    artist: "Paul Cézanne",
    artworkDate: "ca. 1890–92",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP231550.jpg",
    blurb: "Two men absorbed in their card game, painted with Cézanne's patient geometry. Every fold and shadow builds toward a quiet monumentality.",
  },
  {
    objectId: 437329,
    title: "The Abduction of the Sabine Women",
    artist: "Nicolas Poussin",
    artworkDate: "ca. 1633–34",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-29324-001.jpg",
    blurb: "A dramatic frozen moment of chaos and motion. Poussin channels raw violence into ordered, almost choreographed beauty through his classical composition.",
  },
  {
    objectId: 436002,
    title: "Woman with a Parrot",
    artist: "Gustave Courbet",
    artworkDate: "1866",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-17680-001.jpg",
    blurb: "Courbet's realism meets sensuality as a figure reclines with cascading hair, a bright parrot perched on her raised hand. Nature and the body, intertwined.",
  },
  {
    objectId: 437980,
    title: "Cypresses",
    artist: "Vincent van Gogh",
    artworkDate: "1889",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg",
    blurb: "Dark cypress trees flame upward like green fire against a swirling sky. Van Gogh saw in them the same intensity he felt in his own restless spirit.",
  },
  {
    objectId: 436121,
    title: "A Woman Seated beside a Vase of Flowers",
    artist: "Edgar Degas",
    artworkDate: "1865",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg",
    blurb: "Degas pushes his sitter to the edge of the canvas while an enormous bouquet claims center stage. A radical composition that changed how we see portraiture.",
  },
  {
    objectId: 437826,
    title: "Venus and Adonis",
    artist: "Peter Paul Rubens",
    artworkDate: "ca. 1635",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-19299-001.jpg",
    blurb: "Venus clings desperately to Adonis as he pulls away toward the fatal hunt. Rubens captures the ache of love unable to stop what's coming.",
  },
  {
    objectId: 436528,
    title: "Irises",
    artist: "Vincent van Gogh",
    artworkDate: "1890",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP346474.jpg",
    blurb: "Among Van Gogh's last paintings at Saint-Rémy: irises burst from the earth in deep violet and blue, a celebration of life painted by a man yearning for peace.",
  },
  {
    objectId: 435882,
    title: "Still Life with Apples and a Pot of Primroses",
    artist: "Paul Cézanne",
    artworkDate: "ca. 1890",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT47.jpg",
    blurb: "Cézanne's apples are not mere fruit. They are worlds unto themselves, each one a meditation on color, form, and the patience of looking.",
  },
  {
    objectId: 437879,
    title: "Study of a Young Woman",
    artist: "Johannes Vermeer",
    artworkDate: "ca. 1665–67",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP353256.jpg",
    blurb: "Vermeer's quiet luminosity distilled: a young woman turns toward us, her gaze as soft and direct as the light that falls across her face.",
  },
  {
    objectId: 11417,
    title: "Washington Crossing the Delaware",
    artist: "Emanuel Leutze",
    artworkDate: "1851",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ad/web-large/DP215410.jpg",
    blurb: "An iconic tableau of determination: Washington stands resolute among his weary troops, navigating ice-choked waters on a Christmas night that would turn the tide.",
  },
  {
    objectId: 45434,
    title: "Under the Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    artworkDate: "ca. 1830–32",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/as/web-large/DP130155.jpg",
    blurb: "The raw power of nature rendered in woodblock: foam-tipped claws of water reach for the sky as boats navigate the trough of an enormous wave.",
  },
  {
    objectId: 436946,
    title: "The Brioche",
    artist: "Jean Siméon Chardin",
    artworkDate: "1763",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13655-001.jpg",
    blurb: "A brioche crowned with a sprig of orange blossom sits among fruits and a liqueur bottle. Chardin elevates the everyday to quiet poetry.",
  },
  {
    objectId: 437153,
    title: "Oedipus and the Sphinx",
    artist: "Gustave Moreau",
    artworkDate: "1864",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-14201-023.jpg",
    blurb: "The Sphinx clings to Oedipus in an unsettling embrace. Moreau's symbolist vision transforms the ancient riddle into a confrontation between fate and will.",
  },
  {
    objectId: 438009,
    title: "The Pink Dress",
    artist: "Jean Frédéric Bazille",
    artworkDate: "1864",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1927.jpg",
    blurb: "A young woman in pink gazes out over a sun-drenched village. Bazille captures a moment of quiet contemplation bathed in Mediterranean light.",
  },
  {
    objectId: 459027,
    title: "Portrait of a Woman",
    artist: "Attributed to Jacometto Veneziano",
    artworkDate: "ca. 1485–95",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/rl/web-large/DP221483.jpg",
    blurb: "A small jewel of Venetian portraiture: her steady gaze and simple veil speak of an inner composure that transcends the centuries.",
  },
  {
    objectId: 438821,
    title: "Ia Orana Maria (Hail Mary)",
    artist: "Paul Gauguin",
    artworkDate: "1891",
    primaryImageUrl: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1025.jpg",
    blurb: "Gauguin's first major Tahitian painting reimagines the Annunciation in a tropical paradise, making the sacred feel lush, earthy, and intimately human.",
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Generate artworks for a range of dates
function generateArtworksForDates(startDate: Date, count: number): Artwork[] {
  const artworks: Artwork[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const artwork = ARTWORKS_POOL[i % ARTWORKS_POOL.length];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    artworks.push({
      id: generateId(),
      date: dateStr,
      ...artwork,
    });
  }
  return artworks;
}

// Generate 60 days of artworks centered around today
const today = new Date();
const startDate = new Date(today);
startDate.setDate(today.getDate() - 30);
export const ALL_ARTWORKS = generateArtworksForDates(startDate, 60);

export function getArtworkByDate(dateStr: string): Artwork | undefined {
  return ALL_ARTWORKS.find((a) => a.date === dateStr);
}

export function getWeekArtworks(weekDates: Date[]): (Artwork | undefined)[] {
  return weekDates.map((d) => {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return getArtworkByDate(key);
  });
}

// Local storage helpers for gratitude entries
const STORAGE_KEY = "himekuri_entries";

export function getStoredEntries(): GratitudeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: Omit<GratitudeEntry, "id" | "createdAt">): GratitudeEntry {
  const entries = getStoredEntries();
  // Upsert: remove existing entry for this date, then add new one
  const filtered = entries.filter((e) => e.date !== entry.date);
  const newEntry: GratitudeEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  filtered.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return newEntry;
}

export function getEntryForDate(dateStr: string): GratitudeEntry | undefined {
  return getStoredEntries().find((e) => e.date === dateStr);
}

export function getStreak(): number {
  const entries = getStoredEntries();
  if (entries.length === 0) return 0;

  const dates = entries.map((e) => e.date).sort().reverse();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let streak = 0;
  let checkDate = new Date(todayStr);

  // If no entry today, start checking from yesterday
  if (!dates.includes(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
    if (dates.includes(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
