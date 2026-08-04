export function getActiveSectionItems<
  T extends { isActive?: boolean; sortOrder?: number },
>(items: T[]) {
  return [...items]
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
