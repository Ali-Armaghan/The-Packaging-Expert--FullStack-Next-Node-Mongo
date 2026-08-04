import { connectToDatabase } from "@/lib/db/mongoose";
import { buildDefaultHomePageContent } from "@/lib/home/defaults";
import { serializeHomePage } from "@/lib/home/serialize";
import { HomePage } from "@/models/HomePage";
import type { HomePageContent, HomeSectionKey } from "@/types/homePage";

export async function ensureHomePageSeeded() {
  await connectToDatabase();
  const existing = await HomePage.findOne({ pageKey: "home" }).lean();
  if (existing) return existing;

  const seed = buildDefaultHomePageContent();
  try {
    const created = await HomePage.create(seed);
    return created.toObject();
  } catch {
    // Parallel first-load races can hit the unique pageKey index — re-read.
    const raced = await HomePage.findOne({ pageKey: "home" }).lean();
    if (raced) return raced;
    throw new Error("Failed to seed home page content");
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const doc = await ensureHomePageSeeded();
    return serializeHomePage(doc as unknown as Record<string, unknown>);
  } catch {
    const defaults = buildDefaultHomePageContent();
    return {
      id: "",
      ...defaults,
    };
  }
}

/** Load a single home section (projection) for progressive / partial APIs. */
export async function getHomeSection<K extends HomeSectionKey>(
  section: K,
): Promise<HomePageContent[K]> {
  const defaults = buildDefaultHomePageContent();
  try {
    await ensureHomePageSeeded();
    const doc = await HomePage.findOne({ pageKey: "home" })
      .select({ [section]: 1, pageKey: 1 })
      .lean();

    if (!doc) {
      return defaults[section] as HomePageContent[K];
    }

    const serialized = serializeHomePage(
      doc as unknown as Record<string, unknown>,
    );
    return serialized[section];
  } catch {
    return defaults[section] as HomePageContent[K];
  }
}

export async function getAdminHomePage(): Promise<HomePageContent> {
  const doc = await ensureHomePageSeeded();
  return serializeHomePage(doc as unknown as Record<string, unknown>);
}

export async function updateHomeSection(
  section: HomeSectionKey,
  data: unknown,
) {
  await connectToDatabase();
  await ensureHomePageSeeded();

  const updated = await HomePage.findOneAndUpdate(
    { pageKey: "home" },
    { $set: { [section]: data } },
    { new: true },
  ).lean();

  if (!updated) {
    throw new Error("Home page document not found");
  }

  return serializeHomePage(updated as unknown as Record<string, unknown>);
}

export async function replaceHomePage(data: Omit<HomePageContent, "id" | "pageKey" | "updatedAt">) {
  await connectToDatabase();
  await ensureHomePageSeeded();

  const updated = await HomePage.findOneAndUpdate(
    { pageKey: "home" },
    { $set: data },
    { new: true },
  ).lean();

  if (!updated) {
    throw new Error("Home page document not found");
  }

  return serializeHomePage(updated as unknown as Record<string, unknown>);
}
