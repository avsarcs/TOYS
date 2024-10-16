const navbarlessPage: string[] = ["/login"];

export function hasNavbar(location: string): boolean {
  return !navbarlessPage.includes(location);
}