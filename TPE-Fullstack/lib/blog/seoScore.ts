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
}): { score: number; checks: SeoCheck[] } {
  const title = input.seoTitle || input.title;
  const description = input.seoDescription || input.excerpt;
  const body = stripHtml(input.content).toLowerCase();
  const keyword = input.focusKeyword.trim().toLowerCase();

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
      id: "focus-set",
      label: "Focus keyword set",
      ok: Boolean(keyword),
    },
    {
      id: "focus-title",
      label: "Focus keyword in title",
      ok: keyword ? title.toLowerCase().includes(keyword) : false,
    },
    {
      id: "focus-body",
      label: "Focus keyword in body",
      ok: keyword ? body.includes(keyword) : false,
    },
    {
      id: "focus-meta",
      label: "Focus keyword in meta description",
      ok: keyword ? description.toLowerCase().includes(keyword) : false,
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
