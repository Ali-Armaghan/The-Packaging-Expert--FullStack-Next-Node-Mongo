const STORAGE_KEY = "tpe-quote-journey";
const MAX_STOPS = 25;
const IGNORE_PREFIXES = ["/admin", "/sign-in", "/sign-up", "/api"];

export type QuoteJourneyStop = {
  path: string;
  title: string;
  durationMs: number;
  visitedAt: number;
};

export type QuoteFormSource = {
  page: "home" | "quote" | "product";
  path?: string;
  product?: {
    id: string;
    slug: string;
    name: string;
  };
};

export function quoteSourcePath(source?: QuoteFormSource) {
  if (source?.path) return source.path;
  if (source?.page === "home") return "/";
  if (source?.page === "quote") return "/quote";
  if (source?.product?.slug) return `/products/${source.product.slug}`;
  return undefined;
}

type OpenPage = {
  path: string;
  title: string;
  enteredAt: number;
};

let openPage: OpenPage | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function shouldIgnore(path: string) {
  return IGNORE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function readStops(): QuoteJourneyStop[] {
  if (!canUseStorage()) return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteJourneyStop[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStops(stops: QuoteJourneyStop[]) {
  if (!canUseStorage()) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stops.slice(-MAX_STOPS)));
}

export function journeyPageTitle(path: string) {
  if (path === "/") return "Home";
  if (path === "/quote") return "Quote";
  if (path === "/contact") return "Contact";
  if (path === "/products") return "Products";
  if (path.startsWith("/products/")) {
    const slug = path.replace("/products/", "").split("/")[0] ?? "";
    const docTitle = canUseStorage()
      ? document.title.replace(/\s+\|.+$/, "").trim()
      : "";
    return docTitle || `Product · ${slug.replace(/-/g, " ")}`;
  }
  if (canUseStorage()) {
    const docTitle = document.title.replace(/\s+\|.+$/, "").trim();
    if (docTitle) return docTitle;
  }
  return path;
}

function commitOpenPage() {
  if (!openPage) return;
  const durationMs = Date.now() - openPage.enteredAt;
  if (durationMs < 350) {
    openPage = null;
    return;
  }

  const stops = readStops();
  const last = stops[stops.length - 1];
  if (last && last.path === openPage.path) {
    last.durationMs += durationMs;
  } else {
    stops.push({
      path: openPage.path,
      title: openPage.title,
      durationMs,
      visitedAt: openPage.enteredAt,
    });
  }
  writeStops(stops);
  openPage = null;
}

export function enterJourneyPage(path: string) {
  if (shouldIgnore(path)) {
    commitOpenPage();
    return;
  }
  if (openPage?.path === path) return;
  commitOpenPage();
  openPage = {
    path,
    title: journeyPageTitle(path),
    enteredAt: Date.now(),
  };
}

export function pauseJourneyPage() {
  commitOpenPage();
}

export function snapshotQuoteJourney(): QuoteJourneyStop[] {
  const stops = readStops();
  if (!openPage) return stops;
  return [
    ...stops,
    {
      path: openPage.path,
      title: openPage.title,
      durationMs: Math.max(0, Date.now() - openPage.enteredAt),
      visitedAt: openPage.enteredAt,
    },
  ].slice(-MAX_STOPS);
}

export function formatVisitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes ? `${hours}h ${remMinutes}m` : `${hours}h`;
}
