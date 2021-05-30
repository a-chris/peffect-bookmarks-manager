export default function getFavicon(url?: string | null): string {
  if (url != null && chrome.bookmarks != null) {
    return `chrome://favicon/${url}`;
  } else {
    return '';
  }
}
