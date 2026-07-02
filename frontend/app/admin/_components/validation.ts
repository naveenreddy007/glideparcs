export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const ext = parsed.pathname.split('.').pop()?.toLowerCase();
    if (ext && !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) {
      // Allow URLs without extension if they look like image CDN endpoints (e.g. unsplash/images.ctfassets)
      const host = parsed.hostname.toLowerCase();
      if (!host.includes('image') && !host.includes('img') && !host.includes('unsplash') && !host.includes('ctfassets')) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function isValidHttpUrl(url: string): boolean {
  if (!url) return true; // optional fields
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
