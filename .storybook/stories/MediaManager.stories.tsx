import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EditoraEditor } from "@editora/react";
import {
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ListPlugin,
  BlockquotePlugin,
  LinkPlugin,
  ClearFormattingPlugin,
  HistoryPlugin,
  MediaManagerPlugin,
  SlashCommandsPlugin,
  mediaSlashItems,
  type MediaItem,
  type MediaManagerConfig,
  type MediaProvider,
  type StockPhoto,
} from "@editora/plugins";
import "@editora/themes/themes/default.css";

/**
 * Media Manager stories.
 *
 * Every story here is self-contained: where a story needs a "server" it is a small in-memory fake, so nothing
 * leaves the page. Each editor is given its own settings with `MediaManagerPlugin({ ... })`; on a docs page with
 * several editors, the editor you last created or focused decides what a *paste* uploads with.
 */
const meta: Meta<typeof EditoraEditor> = {
  title: "Editor/Media Manager",
  component: EditoraEditor,
  parameters: { layout: "padded", docs: { source: { type: "code" } } },
};

export default meta;
type Story = StoryObj<typeof EditoraEditor>;

// ── helpers: pictures and fake backends ────────────────────────────────────────────────────────

const COLORS = ["#4f7cff", "#e5484d", "#30a46c", "#f5a524", "#8e4ec6", "#12a594", "#d6409f", "#6e56cf"];
const TOPICS = ["Aurora", "Canyon", "Lagoon", "Meadow", "Glacier", "Orchard", "Harbor", "Savanna", "Fjord", "Bazaar", "Lantern", "Terrace"];

/** A picture made of two flat shapes, as an SVG data URL: something to show without any files. */
const picture = (n: number, width: number, height: number): string => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<rect width="${width}" height="${height}" fill="${COLORS[n % COLORS.length]}"/>` +
    `<circle cx="${width * 0.75}" cy="${height * 0.3}" r="${height * 0.14}" fill="rgba(255,255,255,.4)"/>` +
    `<path d="M0 ${height} L${width * 0.3} ${height * 0.45} L${width * 0.55} ${height * 0.8} L${width * 0.75} ${height * 0.55} L${width} ${height}Z" fill="rgba(0,0,0,.25)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(Object.assign(new Error("Upload cancelled"), { name: "AbortError" }));
    });
  });

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Couldn't read the file."));
    reader.readAsDataURL(file);
  });

/** A "server" that keeps what it is given in memory, pages and searches it, and can delete from it. */
const makeLibrary = (seed = 30, delay = 400): MediaProvider => {
  let items: MediaItem[] = Array.from({ length: seed }, (_, i) => ({
    id: `seed-${i + 1}`,
    name: `${TOPICS[i % TOPICS.length].toLowerCase()}-${i + 1}.jpg`,
    type: "image",
    src: picture(i, 1200, 800),
    thumbnailUrl: picture(i, 240, 160),
    size: 120_000 + i * 9371,
    width: 1200,
    height: 800,
    mime: "image/jpeg",
    createdAt: Date.now() - i * 3_600_000,
    metadata: {},
    alt: i % 3 === 0 ? `${TOPICS[i % TOPICS.length]} at golden hour` : undefined,
  }));

  return {
    name: "in-memory library",
    async upload(file, { signal, onProgress }) {
      // Progress that is true to the pace of this fake: five steps over the delay.
      for (let step = 1; step <= 5; step++) {
        await wait(delay / 5, signal);
        onProgress?.({ loaded: step, total: 5, fraction: step / 5 });
      }
      const src = await readAsDataUrl(file);
      const item: MediaItem = {
        id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image",
        src,
        thumbnailUrl: src,
        size: file.size,
        mime: file.type,
        createdAt: Date.now(),
        metadata: {},
      };
      items = [item, ...items];
      return item;
    },
    async list(query = {}, context = {}) {
      await wait(delay, context.signal);
      const search = (query.search ?? "").toLowerCase();
      const matching = items.filter((item) => (!query.type || item.type === query.type) && (!search || item.name.toLowerCase().includes(search)));
      const page = query.page ?? 1;
      const limit = query.limit ?? 24;
      return { items: matching.slice((page - 1) * limit, page * limit), total: matching.length };
    },
    async delete(id) {
      await wait(delay / 2);
      items = items.filter((item) => item.id !== id);
    },
  };
};

/** A "stock photo service" with the shape of the real ones: searchable, paged, with authors. */
const stockPhotos: StockPhoto[] = Array.from({ length: 48 }, (_, i) => ({
  id: String(i + 1),
  thumbnailUrl: picture(i + 3, 240, 160),
  url: picture(i + 3, 1600, 1000),
  width: 1600,
  height: 1000,
  description: `${TOPICS[i % TOPICS.length]} in soft light`,
  author: ["Ada Lovelace", "Grace Hopper", "Alan Kay"][i % 3],
  sourceUrl: `https://example.com/photos/${i + 1}`,
}));

const demoStock: NonNullable<MediaManagerConfig["stockProvider"]> = {
  name: "Stock Photos",
  async search({ search, page, limit }, { signal }) {
    await wait(400, signal);
    const matching = stockPhotos.filter((photo) => !search || photo.description!.toLowerCase().includes(search.toLowerCase()));
    return { items: matching.slice((page - 1) * limit, page * limit), total: matching.length };
  },
};

/** Stands in for a service that describes pictures. It does not look at the picture. */
const demoAltText: NonNullable<MediaManagerConfig["generateAltText"]> = async ({ name }, { signal }) => {
  await wait(700, signal);
  return `A scenic landscape${name ? ` (${name})` : ""} with soft light and gentle colours.`;
};

const basePlugins = () => [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  ListPlugin(),
  BlockquotePlugin(),
  LinkPlugin(),
  ClearFormattingPlugin(),
  HistoryPlugin(),
];

const Editor = ({ media, intro, extra = [] }: { media: Partial<MediaManagerConfig>; intro: string; extra?: unknown[] }) => (
  <EditoraEditor
    plugins={[...basePlugins(), MediaManagerPlugin(media), ...(extra as never[])]}
    statusbar={{ enabled: false }}
    defaultValue={`<h2>Media manager</h2><p>${intro}</p><p>Click an image, a video or a player to edit it; paste or drop a picture to upload it.</p><p><br></p>`}
  />
);

// ── stories ────────────────────────────────────────────────────────────────────────────────────

/** Nothing configured: files become data URLs and stay in the document. */
export const Default: Story = {
  render: () => <Editor media={{}} intro="With no server, an image you upload is embedded in the document itself. Try Image in the toolbar." />,
};

/** The shortest way to use your own storage: a function that takes the file and gives back a URL. */
export const WithUploadHandler: Story = {
  render: () => (
    <Editor
      intro="Uploads go through a function. This one takes two seconds and reports its progress, so you can see the bar, cancel it, or watch a failed one explain itself (name a file with 'fail')."
      media={{
        uploadHandler: async (file, { onProgress, signal }) => {
          for (let step = 1; step <= 10; step++) {
            await wait(200, signal);
            onProgress?.({ loaded: step, total: 10, fraction: step / 10 });
          }
          if (/fail/i.test(file.name)) throw new Error("The storage service is unavailable. Try again.");
          return readAsDataUrl(file);
        },
        maxFileSize: 5 * 1024 * 1024,
      }}
    />
  ),
};

/** A provider that can list: the picker gets a searchable, paged library, with delete. */
export const WithLibrary: Story = {
  render: () => (
    <Editor
      intro="This editor has a library of 30 pictures behind a fake server. Choose several in Image to insert them together, or as a gallery."
      media={{ provider: makeLibrary() }}
    />
  ),
};

/** A Stock tab and a Suggest button for alt text, both calling functions you write. */
export const StockPhotosAndAltText: Story = {
  render: () => (
    <Editor
      intro="Image has a Stock Photos tab (credits become captions) and a Suggest button next to the alt text, both backed by fake services."
      media={{ stockProvider: demoStock, generateAltText: demoAltText, provider: makeLibrary(12) }}
    />
  ),
};

/** Audio, and YouTube and Vimeo players, with the slash menu: type / and choose Image, Video or Audio. */
export const AudioEmbedsAndSlashMenu: Story = {
  render: () => (
    <Editor
      intro="Type / and choose Audio or Video (its Embed tab takes a YouTube or Vimeo link). The toolbar has an Audio button because audio: true."
      media={{ audio: true, provider: makeLibrary(6) }}
      extra={[SlashCommandsPlugin({ items: mediaSlashItems })]}
    />
  ),
};

/** Large pictures are scaled down and re-encoded before they are stored. */
export const OptimizedUploads: Story = {
  render: () => (
    <Editor
      intro="Upload a photo wider than 1200px: it is scaled down to 1200 and written as WebP before it is stored, so a 12 MB camera photo can pass the 2 MB limit."
      media={{ optimizeImages: { maxWidth: 1200, quality: 0.8, format: "webp" }, maxFileSize: 2 * 1024 * 1024 }}
    />
  ),
};

/** Plain `<img>` and `<video>`, as before figures. */
export const WithoutFigures: Story = {
  render: () => <Editor media={{ wrapInFigure: false, uploadOnPaste: false }} intro="Media goes in as a bare image or video: no captions, no alignment figure, and pasting a picture is left to the browser." />,
};
