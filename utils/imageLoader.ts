// Custom image loader to handle various CDN domains
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's an Uploadcare URL, return as-is since they handle optimization
  if (src.includes('ucarecd.net') || src.includes('ucarecdn.com')) {
    return src;
  }
  
  // If it's an Unsplash URL, add optimization parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    return url.toString();
  }
  
  // For other URLs, return as-is
  return src;
}
