export const BLOCKED_HOSTS = [
  'github.com', 'linkedin.com', 'spotify.com', 'open.spotify.com',
  'instagram.com', 'twitter.com', 'x.com', 'facebook.com',
  'google.com', 'youtube.com', 'notion.so', 'notion.site',
  'figma.com', 'canva.com',
];

export const isLikelyBlocked = (url) => {
  if (!url || url === 'about:blank') return false;
  try {
    const host = new URL(url).hostname;
    return BLOCKED_HOSTS.some(b => host === b || host.endsWith('.' + b));
  } catch {
    return false;
  }
};
