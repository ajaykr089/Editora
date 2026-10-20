import { describe, expect, it } from 'vitest';
import { parseEmbedUrl, parseTimestamp, type EmbedProvider } from '../embeds/providers';

const src = (input: string) => parseEmbedUrl(input)?.src;

describe('YouTube links', () => {
  const ID = 'dQw4w9WgXcQ';
  const embed = `https://www.youtube-nocookie.com/embed/${ID}`;

  it('become the privacy-enhanced player, whichever way the link was written', () => {
    expect(src(`https://www.youtube.com/watch?v=${ID}`)).toBe(embed);
    expect(src(`https://youtube.com/watch?v=${ID}&feature=share&list=PLabcdefghij`)).toBe(embed);
    expect(src(`https://m.youtube.com/watch?v=${ID}`)).toBe(embed);
    expect(src(`https://youtu.be/${ID}`)).toBe(embed);
    expect(src(`https://youtu.be/${ID}?si=abc123`)).toBe(embed);
    expect(src(`https://www.youtube.com/embed/${ID}`)).toBe(embed);
    expect(src(`https://www.youtube-nocookie.com/embed/${ID}`)).toBe(embed);
    expect(src(`https://www.youtube.com/live/${ID}`)).toBe(embed);
    expect(src(`www.youtube.com/watch?v=${ID}`)).toBe(embed);
    expect(src(`  https://youtu.be/${ID}  `)).toBe(embed);
  });

  it('keeps a start time, as seconds or as 1m30s', () => {
    expect(src(`https://youtu.be/${ID}?t=90`)).toBe(`${embed}?start=90`);
    expect(src(`https://www.youtube.com/watch?v=${ID}&t=1m30s`)).toBe(`${embed}?start=90`);
    expect(src(`https://www.youtube.com/watch?v=${ID}&start=1h0m5s`)).toBe(`${embed}?start=3605`);
    expect(src(`https://youtu.be/${ID}?t=nonsense`)).toBe(embed);
    expect(src(`https://youtu.be/${ID}?t=0`)).toBe(embed);
  });

  it('knows a Short is upright, and a playlist', () => {
    expect(parseEmbedUrl(`https://www.youtube.com/shorts/${ID}`)?.aspectRatio).toBeCloseTo(9 / 16);
    expect(parseEmbedUrl(`https://www.youtube.com/watch?v=${ID}`)?.aspectRatio).toBeCloseTo(16 / 9);
    expect(src('https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf')).toBe(
      'https://www.youtube-nocookie.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    );
  });

  it('refuses an id that is not one, so nothing else can be put in the address', () => {
    expect(parseEmbedUrl('https://www.youtube.com/watch?v=short')).toBeNull();
    expect(parseEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ"onload="x')).toBeNull();
    expect(parseEmbedUrl('https://www.youtube.com/embed/..%2F..%2Fevil')).toBeNull();
    expect(parseEmbedUrl('https://youtu.be/dQw4w9WgXc?')).toBeNull();
    expect(parseEmbedUrl('https://www.youtube.com/playlist?list=a b')).toBeNull();
    expect(parseEmbedUrl('https://www.youtube.com/')).toBeNull();
  });

  it('is only for YouTube: a look-alike host is not', () => {
    expect(parseEmbedUrl(`https://youtube.com.evil.test/watch?v=${ID}`)).toBeNull();
    expect(parseEmbedUrl(`https://evil.test/watch?v=${ID}`)).toBeNull();
    expect(parseEmbedUrl(`https://notyoutube.com/watch?v=${ID}`)).toBeNull();
    expect(parseEmbedUrl(`https://evil.test/?u=https://youtu.be/${ID}`)).toBeNull();
  });
});

describe('Vimeo links', () => {
  it('become the player, with tracking off', () => {
    expect(src('https://vimeo.com/76979871')).toBe('https://player.vimeo.com/video/76979871?dnt=1');
    expect(src('https://www.vimeo.com/channels/staffpicks/76979871')).toBe('https://player.vimeo.com/video/76979871?dnt=1');
    expect(src('https://vimeo.com/groups/shortfilms/videos/76979871')).toBe('https://player.vimeo.com/video/76979871?dnt=1');
    expect(src('https://player.vimeo.com/video/76979871')).toBe('https://player.vimeo.com/video/76979871?dnt=1');
  });

  it('keeps the hash of a private link', () => {
    expect(src('https://vimeo.com/76979871/a1b2c3d4e5')).toBe('https://player.vimeo.com/video/76979871?dnt=1&h=a1b2c3d4e5');
    expect(src('https://player.vimeo.com/video/76979871?h=a1b2c3d4e5')).toBe('https://player.vimeo.com/video/76979871?dnt=1&h=a1b2c3d4e5');
    expect(src('https://vimeo.com/76979871/not-a-hash!')).toBe('https://player.vimeo.com/video/76979871?dnt=1');
  });

  it('wants a video, and Vimeo', () => {
    expect(parseEmbedUrl('https://vimeo.com/')).toBeNull();
    expect(parseEmbedUrl('https://vimeo.com/staffpicks')).toBeNull();
    expect(parseEmbedUrl('https://vimeo.com.evil.test/76979871')).toBeNull();
  });
});

describe('what is pasted', () => {
  it('reads the src of an iframe snippet and ignores the rest of it', () => {
    const snippet = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=x" onload="alert(1)" allow="camera"></iframe>';
    const found = parseEmbedUrl(snippet)!;
    expect(found.src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(found.src).not.toMatch(/alert|camera|onload/);
  });

  it('refuses things that are not links to a known player', () => {
    for (const input of ['', '   ', 'hello', 'javascript:alert(1)', 'data:text/html,<script>', 'ftp://youtu.be/dQw4w9WgXcQ', 'https://example.com/video.mp4', 'two words https://youtu.be/dQw4w9WgXcQ']) {
      expect(parseEmbedUrl(input), input).toBeNull();
    }
  });

  it('always gives back an https address', () => {
    expect(parseEmbedUrl('http://youtu.be/dQw4w9WgXcQ')!.src.startsWith('https://')).toBe(true);
  });
});

describe('other providers', () => {
  const loom: EmbedProvider = {
    id: 'loom',
    label: 'Loom video',
    parse: (url) => (url.hostname === 'www.loom.com' && /^\/share\/(\w+)$/.test(url.pathname) ? { src: `https://www.loom.com/embed/${url.pathname.slice(7)}`, id: url.pathname.slice(7) } : null),
  };

  it('can be added, and are asked first', () => {
    expect(parseEmbedUrl('https://www.loom.com/share/abc123', [loom])).toMatchObject({ provider: 'loom', label: 'Loom video', src: 'https://www.loom.com/embed/abc123' });
    expect(parseEmbedUrl('https://www.loom.com/share/abc123')).toBeNull();
  });

  it('may not hand back an address that is not https, whatever they were given', () => {
    const bad: EmbedProvider = { id: 'bad', label: 'Bad', parse: () => ({ src: 'javascript:alert(1)', id: 'x' }) };
    expect(parseEmbedUrl('https://example.com/x', [bad])).toBeNull();
    const mixed: EmbedProvider = { id: 'mixed', label: 'Mixed', parse: () => ({ src: 'http://example.com/x', id: 'x' }) };
    expect(parseEmbedUrl('https://example.com/x', [mixed])).toBeNull();
  });
});

describe('timestamps', () => {
  it('reads seconds and h/m/s', () => {
    expect(parseTimestamp('90')).toBe(90);
    expect(parseTimestamp('1m30s')).toBe(90);
    expect(parseTimestamp('2h')).toBe(7200);
    expect(parseTimestamp('45s')).toBe(45);
    expect(parseTimestamp('')).toBeNull();
    expect(parseTimestamp(null)).toBeNull();
    expect(parseTimestamp('abc')).toBeNull();
    expect(parseTimestamp('1x')).toBeNull();
  });
});
