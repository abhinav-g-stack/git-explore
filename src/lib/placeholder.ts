const DICEBEAR_BASE = "https://api.dicebear.com/9.x";

type PlaceholderStyle = "shapes" | "initials" | "glass" | "rings" | "bottts";

function buildDiceBearUrl(
  seed: string,
  style: PlaceholderStyle,
  size?: number,
): string {
  const params = new URLSearchParams({ seed });
  if (size) params.set("size", size.toString());
  return `${DICEBEAR_BASE}/${style}/svg?${params.toString()}`;
}

function isRealImage(url: string): boolean {
  if (!url) return false;
  if (url.includes("placehold.co")) return false;
  return (
    url.startsWith("http") ||
    url.startsWith("data:image") ||
    url.startsWith("/")
  );
}

export function getProductImageUrl(
  imageUrl: string,
  productName: string,
): string {
  if (isRealImage(imageUrl)) return imageUrl;
  return buildDiceBearUrl(productName, "shapes");
}

export function getUserAvatarUrl(name: string): string {
  return buildDiceBearUrl(name, "initials");
}

export function getBackgroundUrl(seed: string): string {
  return buildDiceBearUrl(seed, "glass");
}
