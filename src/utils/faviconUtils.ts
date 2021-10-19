export default function getFavicon(online: boolean, url?: string | null): string {
  if (url != null && online) {
    const { hostname } = new URL(url);
    return `https://${hostname}/favicon.ico`;
  } else if (url != null && !online && chrome.bookmarks != null) {
    /*
     * WARNING: using chrome://favicon slow down the entire application
     * I'm avoiding it at the moment
     */
    return `chrome://favicon/${url}`;
  } else {
    return '';
  }
}
