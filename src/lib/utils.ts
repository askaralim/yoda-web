/**
 * Get the full image URL for a given image path
 * @param imagePath - The image path from the API
 * @returns The full URL for the image
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/placeholder-image.jpg'; // Fallback image
  }

  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, construct the full URL
  if (imagePath.startsWith('/uploads/')) {
    return imagePath; // This will be handled by Next.js rewrite
  }

  // If it's just a filename, assume it's in uploads
  if (!imagePath.startsWith('/')) {
    return `/uploads/${imagePath}`;
  }

  return imagePath;
}

/**
 * Get the API base URL
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
}

/**
 * Format date to Chinese locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN');
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
