const navbarlessPage: string[] = ["/login", "/", "/group-tour-application", "/individual-tour-application"];

export function hasNavbar(location: string): boolean {
  return !navbarlessPage.includes(location);
}

export function isObjectEmpty(obj: any) {
  //@ts-ignore
  for(const _ in obj) return false;
  return true;
}