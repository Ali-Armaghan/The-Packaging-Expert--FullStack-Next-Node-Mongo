export type SeoCheck = {
  id: string;
  label: string;
  ok: boolean;
  hint?: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildSeoChecks(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageAlt: string;
  featuredImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  secondaryKeywords?: string[];
}): { score: number; checks: SeoCheck[] } {
  const title = input.seoTitle || input.title;
  const description = input.seoDescription || input.excerpt;
  const body = stripHtml(input.content).toLowerCase();
  const keyword = input.focusKeyword.trim().toLowerCase();
  const secondary = (input.secondaryKeywords ?? [])
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const checks: SeoCheck[] = [
    {
      id: "title-length",
      label: "SEO title length (30–60)",
      ok: title.length >= 30 && title.length <= 60,
      hint: `${title.length} chars`,
    },
    {
      id: "desc-length",
      label: "Meta description length (70–160)",
      ok: description.length >= 70 && description.length <= 160,
      hint: `${description.length} chars`,
    },
    {
      id: "slug",
      label: "URL slug is set",
      ok: Boolean(input.slug.trim()),
    },
    {
      id: "featured-image",
      label: "Featured image uploaded",
      ok: Boolean(input.featuredImageUrl.trim()),
    },
    {
      id: "featured-alt",
      label: "Featured image has alt text",
      ok: Boolean(input.featuredImageAlt.trim()),
    },
    {
      id: "content-length",
      label: "Body has enough content (300+ words)",
      ok: stripHtml(input.content).split(/\s+/).filter(Boolean).length >= 300,
      hint: `${stripHtml(input.content).split(/\s+/).filter(Boolean).length} words`,
    },
    {
      id: "primary-set",
      label: "Primary keyword set",
      ok: Boolean(keyword),
    },
    {
      id: "primary-title",
      label: "Primary keyword in title",
      ok: keyword ? title.toLowerCase().includes(keyword) : false,
    },
    {
      id: "primary-body",
      label: "Primary keyword in body",
      ok: keyword ? body.includes(keyword) : false,
    },
    {
      id: "primary-meta",
      label: "Primary keyword in meta description",
      ok: keyword ? description.toLowerCase().includes(keyword) : false,
    },
    {
      id: "secondary-set",
      label: "At least one secondary keyword set",
      ok: secondary.length > 0,
    },
    {
      id: "secondary-body",
      label: "A secondary keyword appears in body",
      ok: secondary.length > 0 ? secondary.some((k) => body.includes(k)) : false,
    },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}

export function estimateReadingMinutes(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
