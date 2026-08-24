/** Routes that use the home2 glass studio chrome (header + dark theme hooks). */
export function isHome2Route(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/products/")
  );
}
