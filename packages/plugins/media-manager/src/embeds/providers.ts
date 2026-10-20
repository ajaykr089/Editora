/**
 * Which links can become an embedded player, and the one address each is embedded from.
 *
 * The iframe's address is *built* here from an identifier that has been checked (11 characters of a fixed set for
 * YouTube, digits for Vimeo), never copied from what was pasted, so a link cannot smuggle in another host, a
 * script URL or extra parameters. A pasted `<iframe>` snippet is read for its `src` and the rest is thrown away.
 */
export interface EmbedSpec {
  /** `youtube`, `vimeo`, or the id of a provider you added. */
  provider: string;
  /** What to call it: "YouTube video". */
  label: string;
  /** The address the iframe loads. Always https. */
  src: string;
  /** Width over height. */
  aspectRatio: number;
  /** The video's id at the provider, for telling embeds apart. */
  id: string;
}

export interface EmbedProvider {
  id: string;
  label: string;
  /** Read a link; return what to embed, or `null` when it is not yours. */
  parse(url: URL): { src: string; id: string; aspectRatio?: number } | null;
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com']);
const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_LIST = /^[\w-]{10,64}$/;

/** `90`, `1m30s`, `1h2m3s` as seconds, or `null`. */
export const parseTimestamp = (value: string | null): number | null => {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match || !(match[1] || match[2] || match[3])) return null;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
};

export const youtube: EmbedProvider = {
  id: 'youtube',
  label: 'YouTube video',
  parse(url) {
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let id: string | null = null;
    let aspectRatio: number | undefined;

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (YOUTUBE_HOSTS.has(host)) {
      const [first, second] = url.pathname.split('/').filter(Boolean);
      if (first === 'watch') id = url.searchParams.get('v');
      else if (first === 'embed' || first === 'v' || first === 'live') id = second ?? null;
      else if (first === 'shorts') {
        id = second ?? null;
        aspectRatio = 9 / 16;
      }
      if (!id && url.searchParams.get('list') && (first === 'playlist' || first === 'watch')) {
        const list = url.searchParams.get('list')!;
        if (!YOUTUBE_LIST.test(list)) return null;
        return {
          src: `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`,
          id: `list:${list}`,
        };
      }
    }
    if (!id || !YOUTUBE_ID.test(id)) return null;

    const start = parseTimestamp(url.searchParams.get('t') ?? url.searchParams.get('start'));
    return {
      src: `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`,
      id,
      aspectRatio,
    };
  },
};

export const vimeo: EmbedProvider = {
  id: 'vimeo',
  label: 'Vimeo video',
  parse(url) {
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    // vimeo.com/123, vimeo.com/channels/staffpicks/123, vimeo.com/groups/x/videos/123, player.vimeo.com/video/123
    const index = parts.findIndex((part) => /^\d{5,12}$/.test(part));
    if (index === -1) return null;
    const id = parts[index];
    // A private link carries a hash: vimeo.com/123/abcdef0123, or ?h= on the player.
    const hash = parts[index + 1] ?? url.searchParams.get('h');
    const params = new URLSearchParams({ dnt: '1' });
    if (hash && /^[a-f0-9]{6,20}$/i.test(hash)) params.set('h', hash);
    return { src: `https://player.vimeo.com/video/${id}?${params}`, id };
  },
};

export const DEFAULT_EMBED_PROVIDERS: EmbedProvider[] = [youtube, vimeo];

/** The `src` of an `<iframe ...>` snippet, if that is what was pasted. */
const srcOfSnippet = (input: string): string | null => /<iframe\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/i.exec(input)?.[1] ?? null;

/**
 * What a pasted link or iframe snippet embeds, or `null` when it is not a link the providers know. `extra`
 * providers are asked first.
 */
export const parseEmbedUrl = (input: string, extra: EmbedProvider[] = []): EmbedSpec | null => {
  const raw = (srcOfSnippet(input) ?? input).trim();
  if (!raw || /\s/.test(raw)) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  for (const provider of [...extra, ...DEFAULT_EMBED_PROVIDERS]) {
    const found = provider.parse(url);
    if (!found) continue;
    // Whatever a provider gives back must itself be https: it is what the iframe will load.
    if (!/^https:\/\/[^\s]+$/.test(found.src)) return null;
    return { provider: provider.id, label: provider.label, src: found.src, id: found.id, aspectRatio: found.aspectRatio ?? 16 / 9 };
  }
  return null;
};
